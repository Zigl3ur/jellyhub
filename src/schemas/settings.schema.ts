import { z } from "zod";

export const addServerSchema = z.object({
  url: z.url({ error: "Please enter a valid URL" }),
  username: z.string().min(1, { error: "Provide a server username" }),
  password: z.string().min(1, { error: "Provide a server password" }),
});

export type addServerSchemaType = z.output<typeof addServerSchema>;

export const editProfileSchema = z.object({
  image: z
    .string()
    .transform((val) => val.replace(/^data:image\/\w+;base64,/, ""))
    .pipe(z.base64())
    .optional()
    .nullable(),
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters long" })
    .max(15, { error: "Username cant exceed 15 characters" })
    .optional()
    .nullable(),
});

export type editProfileSchemaType = z.output<typeof editProfileSchema>;

export const resetPasswdSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" })
      .max(50, { error: "Password cant exceed 50 characters" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" })
      .max(50, { error: "Password cant exceed 50 characters" }),
    confirmPassword: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" })
      .max(50, { error: "Password cant exceed 50 characters" }),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
        input: ctx.value.confirmPassword,
      });
    }
  });

export type resetPasswdType = z.output<typeof resetPasswdSchema>;

export const deleteAccountSchema = z
  .object({
    confirm: z
      .string()
      .min(1, { error: "Please confirm by typing 'delete my account'" }),
  })
  .refine((data) => data.confirm === "delete my account", {
    message: "Please confirm by typing 'delete my account'",
    path: ["confirm"],
  });

export type deleteAccountSchemaType = z.output<typeof deleteAccountSchema>;

export const endSetupSchema = z.object({
  admin: z.object({
    username: z
      .string()
      .min(3, { error: "Admin username must be at least 3 characters long" })
      .max(15, { error: "Admin username cant exceed 15 characters" }),
    password: z
      .string()
      .min(6, { error: "Admin password must be at least 6 characters long" })
      .max(50, { error: "Admin password cant exceed 50 characters" }),
  }),
  users: z.array(
    z.object({
      username: z
        .string()
        .min(3, { error: "User username must be at least 3 characters long" })
        .max(15, { error: "User username cant exceed 15 characters" }),
      password: z
        .string()
        .min(6, { error: "User password must be at least 6 characters long" })
        .max(50, { error: "User password cant exceed 50 characters" }),
    }),
  ),
  servers: z.array(
    z.object({
      url: z.url({ error: "Please enter a valid URL" }),
      name: z.string({ error: "Provide a server name" }),
      username: z.string().min(1, { error: "Provide a server username" }),
      token: z.string({ error: "Provide a server token" }),
    }),
  ),
});

export type endSetupSchemaType = z.output<typeof endSetupSchema>;

export const apiJellyfinSchema = z.object({
  url: z.url({ error: "Please enter a valid URL" }),
});

export type apiJellyfinSchemaType = z.output<typeof apiJellyfinSchema>;

export const addSsoSchema = z.object({
  providerId: z
    .string()
    .min(1, { error: "Provider ID is required" })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      error: "Only letters, numbers, dashes and underscores are allowed",
    }),
  domain: z.string().min(1, { error: "Domain is required" }),
  issuer: z.url({
    protocol: /^https?$/,
    error: "Please enter a valid URL",
  }),
  clientId: z.string().min(1, { error: "Client ID is required" }),
  clientSecret: z.string().min(1, { error: "Client secret is required" }),
});

export type addSsoSchemaType = z.output<typeof addSsoSchema>;
