import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  appName: "Jellyhub",
  advanced: {
    cookiePrefix: "Jellyhub",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    deleteUser: { enabled: true },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false, //TODO: can be setup in settings
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
