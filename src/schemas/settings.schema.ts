import { z } from "zod";

export const addServerSchema = z.object({
  url: z.url({ error: "Please enter a valid URL" }),
  username: z.string().min(1, { error: "Provide a server username" }),
  password: z.string().min(1, { error: "Provide a server password" }),
});

export type addServerSchemaType = z.output<typeof addServerSchema>;

export const editUserSchema = z
  .object({
    username: z.optional(
      z
        .string()
        .min(3, { error: "Username must be at least 3 characters long" })
        .max(15, { error: "Username cant exceed 15 characters" }),
    ),
    password: z.optional(
      z
        .string()
        .min(6, { error: "Password must be at least 6 characters long" })
        .max(50, { error: "Password cant exceed 50 characters" }),
    ),
    confirmPassword: z.optional(
      z
        .string()
        .min(6, { error: "Password must be at least 6 characters long" })
        .max(50, { error: "Password cant exceed 50 characters" }),
    ),
  })
  .check((ctx) => {
    if (ctx.value.password && ctx.value.confirmPassword?.length === 0) {
      ctx.issues.push({
        code: "custom",
        message: "Confirm the new password",
        path: ["confirmPassword"],
        input: ctx.value.confirmPassword,
      });
    }
    if (ctx.value.password !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
        input: ctx.value.confirmPassword,
      });
    }
  });

export type editUserSchemaType = z.output<typeof editUserSchema>;

export const resetPasswdScema = z
  .object({
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

export type resetPasswdType = z.output<typeof resetPasswdScema>;

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
      username: z.string().min(1, { error: "Provide a server username" }),
      token: z.string({ error: "Provide a server token" }),
    }),
  ),
});

export type endSetupSchemaType = z.output<typeof endSetupSchema>;
