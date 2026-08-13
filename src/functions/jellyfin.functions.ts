import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "./middlewares";
import type { ItemServerData, ItemsOpts } from "@/types";
import {
  authJellyfinUser,
  checkJellyfinConn,
  getItemImages,
  getJellyfinApiClient,
  getJellyfinPublicInfo,
  getLibraryItems,
  logoutJellyfinUser,
} from "@/lib/api.jellyfin";
import { apiJellyfinSchema } from "@/schemas/settings.schema";
import db from "@/lib/db";
import { jellydata } from "@/lib/db/schema";

export const getServerToken = createServerOnlyFn(async (serverUrl: string) => {
  try {
    const server = await db.query.jellydata.findFirst({
      where: {
        serverUrl: serverUrl,
      },
      columns: {
        serverToken: true,
      },
    });

    if (!server) throw new Error("Server not found");

    return server.serverToken ? server.serverToken : undefined;
  } catch {
    throw new Error("Failed to get server token");
  }
});

export const getServerInfo = createServerFn({ method: "GET" })
  .validator(apiJellyfinSchema)
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    const info = await getJellyfinPublicInfo(api);

    return info;
  });

export const getServerAuthToken = createServerFn({ method: "GET" })
  .validator(
    (data: { url: string; username: string; password: string }) => data,
  )
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    return await authJellyfinUser(api, data.username, data.password);
  });

export const invalidateServerTokenDB = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(apiJellyfinSchema)
  .handler(async ({ context, data }) => {
    const token = await getServerToken(data.url);

    const api = getJellyfinApiClient(data.url, token);

    const status = await checkJellyfinConn(api);

    if (!token || !status) return;

    await logoutJellyfinUser(api);

    await context.db
      .update(jellydata)
      .set({
        serverToken: null,
      })
      .where(
        and(
          eq(jellydata.userId, context.session.user.id),
          eq(jellydata.serverUrl, data.url),
        ),
      );
  });

export const invalidateServerToken = createServerFn({ method: "GET" })
  .validator(
    apiJellyfinSchema.extend({
      token: z.string({ error: "Provide a server token" }),
    }),
  )
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url, data.token);

    const status = await checkJellyfinConn(api);

    if (!data.token || !status) return;

    await logoutJellyfinUser(api);
  });

export const refreshServerToken = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    apiJellyfinSchema.extend({
      password: z.string({ error: "Provide a server password" }),
    }),
  )
  .handler(async ({ context, data }) => {
    const { url, password } = data;

    const token = await getServerToken(url);
    const api = getJellyfinApiClient(url, token);
    const newApi = getJellyfinApiClient(url);

    const server = await context.db.query.jellydata.findFirst({
      where: {
        serverUrl: url,
        userId: context.session.user.id,
      },
      columns: {
        serverUsername: true,
      },
    });

    if (!server) throw new Error("Server not found");

    const newAuth = await authJellyfinUser(
      newApi,
      server.serverUsername,
      password,
    );
    const status = await checkJellyfinConn(api);

    if (token && status) await logoutJellyfinUser(api);

    await context.db
      .update(jellydata)
      .set({ serverToken: newAuth.AccessToken })
      .where(
        and(
          eq(jellydata.userId, context.session.user.id),
          eq(jellydata.serverUrl, url),
        ),
      );
  });

export const checkServerConn = createServerFn({ method: "GET" })
  .validator(apiJellyfinSchema)
  .handler(async ({ data }) => {
    const token = await getServerToken(data.url);
    const api = getJellyfinApiClient(data.url, token);

    const status = await checkJellyfinConn(api);

    return { status: status ? "up" : "down" };
  });

export const getServerItems = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { url: string; opts: ItemsOpts }) => data)
  .handler(async ({ data }) => {
    const token = await getServerToken(data.url);
    const api = getJellyfinApiClient(data.url, token);

    const items = await getLibraryItems(api, data.opts);

    if (items.status !== 200) throw new Error("Failed to fetch items");

    const withData = items.data.Items?.map((i) => ({
      ...i,
      PrimaryImage: getItemImages(api, i, "Primary"),
      BackdropImage: getItemImages(api, i, "Backdrop"),
      Server: {
        itemId: i.Id as string,
        id: i.ServerId,
        url: data.url,
      },
    }));

    return withData;
  });

export type ServerItems = NonNullable<
  Awaited<ReturnType<typeof getServerItems>>
>;

export const getServersItems = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { opts: ItemsOpts }) => data)
  .handler(async ({ data, context }) => {
    const servers = await context.db.query.jellydata.findMany({
      where: {
        userId: context.session.user.id,
      },
      columns: {
        serverUrl: true,
        serverName: true,
        serverToken: true,
      },
    });

    if (!servers.length) return [];

    const serversFetch = await Promise.allSettled(
      servers.map(async (server) => {
        const token = await getServerToken(server.serverUrl);
        const api = getJellyfinApiClient(server.serverUrl, token);

        const items = await getLibraryItems(api, data.opts);

        if (items.status !== 200) throw new Error("Failed to fetch items");

        const withData = items.data.Items?.map((i) => ({
          ...i,
          PrimaryImage: getItemImages(api, i, "Primary"),
          BackdropImage: getItemImages(api, i, "Backdrop"),
          Server: {
            itemId: i.Id as string,
            id: i.ServerId as string,
            url: server.serverUrl,
            name: server.serverName,
          },
        }));

        return withData;
      }),
    );

    const successfullFetchs = serversFetch
      .filter((fetch) => fetch.status === "fulfilled")
      .flatMap((fetch) => fetch.value);

    const itemsMap = new Map<
      string,
      Omit<ServerItems[number], "Server"> & {
        Servers: Array<ItemServerData>;
      }
    >();

    successfullFetchs.forEach((item) => {
      if (!item) return;

      const name = item.Name?.toLowerCase().replaceAll(" ", "");
      if (!name) return;

      const existingItem = itemsMap.get(name);

      const { Server, ...rest } = item;

      if (
        existingItem &&
        !existingItem.Servers.filter((s) => s.url === Server.url).length
      ) {
        if (
          existingItem.PrimaryImage === "/default.svg" &&
          item.PrimaryImage !== "/default.svg"
        ) {
          existingItem.PrimaryImage = item.PrimaryImage;
        }

        if (
          existingItem.BackdropImage === "/default.svg" &&
          item.BackdropImage !== "/default.svg"
        ) {
          existingItem.BackdropImage = item.BackdropImage;
        }

        existingItem.Servers.push(Server);
      } else {
        itemsMap.set(name, { ...rest, Servers: [Server] });
      }
    });

    return Array.from(itemsMap.values());
  });

export type ServersItems = NonNullable<
  Awaited<ReturnType<typeof getServersItems>>
>;
