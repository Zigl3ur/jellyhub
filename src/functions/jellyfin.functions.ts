import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api";
import z from "zod";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "./middlewares";
import type { ItemsOpts } from "@/types";
import {
  authJellyfinUser,
  checkJellyfinConn,
  getJellyfinApiClient,
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
  .validator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    const info = await getSystemApi(api).getPublicSystemInfo();

    return info.data;
  });

export const getServerAuthToken = createServerFn({ method: "GET" })
  .validator(
    (data: { url: string; username: string; password: string }) => data,
  )
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    return await authJellyfinUser(api, data.username, data.password);
  });

export const invalidateServerToken = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(apiJellyfinSchema)
  .handler(async ({ context, data }) => {
    const token = await getServerToken(data.url);

    if (!token) return;

    const api = getJellyfinApiClient(data.url, token);

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

export const refreshServerToken = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    apiJellyfinSchema.extend({
      username: z.string({ error: "Provide a server username" }),
      password: z.string({ error: "Provide a server password" }),
    }),
  )
  .handler(async ({ context, data }) => {
    const { url, username, password } = data;

    const token = await getServerToken(url);

    const api = getJellyfinApiClient(url, token);
    const newAuth = await authJellyfinUser(api, username, password);

    if (token) await logoutJellyfinUser(api);

    await context.db
      .update(jellydata)
      .set({
        serverToken: newAuth.AccessToken,
      })
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
  .validator((data: { url: string; token: string; opts: ItemsOpts }) => data)
  .handler(async ({ data }) => {
    const token = await getServerToken(data.url);
    const api = getJellyfinApiClient(data.url, token);

    const items = await getLibraryItems(api, data.opts);

    if (items.status !== 200) throw new Error("Failed to fetch items");

    return items.data;
  });
