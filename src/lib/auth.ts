import { betterAuth } from "better-auth";
import { admin, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import db from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  appName: "Jellyhub",
  defaultCookieAttributes: {
    httpOnly: true,
    secure: true,
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
  // log if dev or test but not in prod
  ...(process.env.NODE_ENV === "production" && {
    logger: { log() {} },
  }),
});
