import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { redirect } from "@tanstack/react-router";
import { hasAdminUser } from "./auth.functions";
import { authMiddleware, ctxMiddleware } from "./middlewares";
import { getServerToken } from "./jellyfin.functions";
import {
  addServerSchema,
  apiJellyfinSchema,
  endSetupSchema,
} from "@/schemas/settings.schema";
import { jellydata as jellydataSchema } from "@/lib/db/schema";
import {
  authJellyfinUser,
  getJellyfinApiClient,
  getJellyfinPublicInfo,
  logoutJellyfinUser,
} from "@/lib/api.jellyfin";

export const endSetup = createServerFn({ method: "POST" })
  .middleware([ctxMiddleware])
  .validator(endSetupSchema)
  .handler(async ({ context, data }) => {
    const alreadySetup = await hasAdminUser();

    if (alreadySetup) throw new Error("Setup has already been completed");

    const { admin, users, servers } = data;

    const usersIds = [];

    try {
      const adminUser = await context.auth.api.createUser({
        body: {
          email: `${admin.username}@jellyhub.com`,
          name: admin.username,
          password: admin.password,
          role: "admin",
          data: {
            username: admin.username,
          },
        },
      });

      usersIds.push(adminUser.user.id);

      if (users.length > 0) {
        await Promise.all(
          users.map(async (u) => {
            const user = await context.auth.api.createUser({
              body: {
                email: `${u.username}@jellyhub.com`,
                name: u.username,
                password: u.password,
                role: "user",
              },
            });
            usersIds.push(user.user.id);
          }),
        );
      }

      if (servers.length > 0) {
        await context.db.insert(jellydataSchema).values(
          servers.map((server) => ({
            userId: adminUser.user.id,
            serverUrl: server.url,
            serverName: server.name,
            serverUsername: server.username,
            serverToken: server.token,
          })),
        );
      }
    } catch (err) {
      console.error("[SETUP FAILED]", err);
      await Promise.all(
        usersIds.map(async (id) => {
          await context.auth.api.removeUser({
            body: {
              userId: id,
            },
          });
        }),
      );

      throw new Error("Failed to complete setup, please try again");
    }

    throw redirect({ to: "/" });
  });

export const getJellyData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ updateStatus: z.boolean() }))
  .handler(async ({ context, data }) => {
    const serverList = await context.db.query.jellydata.findMany({
      where: {
        userId: context.session.user.id,
      },
      columns: {
        serverUrl: true,
        serverName: true,
        serverUsername: true,
      },
    });

    if (data.updateStatus) {
      await Promise.allSettled(
        serverList.map(async (server) => {
          const api = getJellyfinApiClient(server.serverUrl);
          const info = await getJellyfinPublicInfo(api);

          if (info.ServerName && info.ServerName !== server.serverName) {
            await context.db
              .update(jellydataSchema)
              .set({ serverName: info.ServerName })
              .where(
                and(
                  eq(jellydataSchema.userId, context.session.user.id),
                  eq(jellydataSchema.serverUrl, server.serverUrl),
                ),
              );
          }
        }),
      );
    }

    return { servers: serverList };
  });

export const addJellyfinServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(addServerSchema)
  .handler(async ({ context, data }) => {
    const { url, username, password } = data;

    const api = getJellyfinApiClient(url);
    const authData = await authJellyfinUser(api, username, password);

    const token = authData.AccessToken;

    if (!token) {
      throw new Error("Failed to retrieve access token from jellyfin server");
    }

    const info = await getJellyfinPublicInfo(api);

    try {
      const inserted = await context.db
        .insert(jellydataSchema)
        .values({
          userId: context.session.user.id,
          serverUrl: url,
          serverName: info.ServerName as string,
          serverUsername: username,
          serverToken: token,
        })
        .onConflictDoNothing({
          target: [jellydataSchema.userId, jellydataSchema.serverUrl],
        })
        .returning();

      if (inserted.length === 0) {
        throw new Error("Server already exists", { cause: "already_exists" });
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error && err.cause === "already_exists") throw err;

      throw new Error(
        "An error occurred while adding the jellyfin server, try again",
      );
    }
  });

export const deleteJellyfinServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(apiJellyfinSchema)
  .handler(async ({ context, data }) => {
    const token = await getServerToken(data.url);

    const api = getJellyfinApiClient(data.url, token);

    if (token) {
      try {
        await logoutJellyfinUser(api);
      } catch {}
    }

    try {
      await context.db
        .delete(jellydataSchema)
        .where(
          and(
            eq(jellydataSchema.userId, context.session.user.id),
            eq(jellydataSchema.serverUrl, data.url),
          ),
        );
    } catch {
      throw new Error("Failed to remove jellyfin server");
    }
  });
