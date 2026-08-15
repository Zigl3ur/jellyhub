import { APIError, betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import db from "./db";
import * as schema from "./db/schema";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
  appName: "Jellyhub",
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
    disableSignUp:
      process.env.DISABLE_SIGNUP === "true" ||
      process.env.ALLOW_SIGNUP !== "true",
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
    tanstackStartCookies(),
  ],
});
