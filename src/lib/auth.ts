import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  appName: "Jellyhub",
  defaultCookieAttributes: {
    httpOnly: true,
    secure: true,
  },
  advanced: {
    cookiePrefix: "jellyhub",
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: process.env.DISABLE_SIGNUP === "true",
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
  ],
});
