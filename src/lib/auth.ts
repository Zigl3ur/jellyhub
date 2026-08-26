import { APIError, betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { sso } from "@better-auth/sso";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import db from "./db";
import * as schema from "./db/schema";
import { createAuthMiddleware } from "better-auth/api";
import { eq } from "drizzle-orm";

const baseUrl = process.env.APP_URL || "http://localhost:3000";

export const auth = betterAuth({
  appName: "Jellyhub",
  secret: process.env.AUTH_SECRET as string,
  baseUrl,
  trustedOrigins: async (request) => {
    if (!request) {
      return [baseUrl];
    }

    const origins = [];

    const existing = await db.query.ssoProvider.findMany({
      columns: { issuer: true },
    });

    origins.push(...existing.map((p) => new URL(p.issuer).origin));

    if (request.url.includes("/sso/register")) {
      try {
        const body = await request.clone().json();
        if (body?.issuer) {
          const origin = new URL(body.issuer).origin;
          origins.push(origin);
        }
      } catch {}
    }

    return origins;
  },
  defaultCookieAttributes: {
    httpOnly: true,
    secure: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/update-user") {
        return;
      }
      const image = ctx.body?.image as string | undefined;
      if (image) {
        const base64Index = image.indexOf(",") + 1;
        const base64Data = base64Index > 0 ? image.slice(base64Index) : image;
        const size = Buffer.byteLength(base64Data, "base64");
        if (size > 10_000_000) {
          throw new APIError("BAD_REQUEST", {
            message: "File size exceeds 10 MB limit",
          });
        }
      }
    }),
  },
  advanced: {
    cookiePrefix: "jellyhub",
    database: {
      generateId: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: process.env.ALLOW_SIGNUP !== "true",
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 50,
  },
  plugins: [
    admin(),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 15,
    }),
    sso({
      provisionUser: async ({ user }) => {
        if (!user.username) {
          const username = user.name
            .slice(0, 15)
            .replace(/[^a-zA-Z0-9-_]/g, "");
          await db
            .update(schema.user)
            .set({ username })
            .where(eq(schema.user.id, user.id));
        }
      },
    }),
    tanstackStartCookies(),
  ],
});
