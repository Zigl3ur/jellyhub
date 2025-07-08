import { z } from "zod/v4";

export const addServerSchema = z.object({
  address: z.url({ message: "Please enter a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type addServerSchemaType = z.output<typeof addServerSchema>;

export const editUserSchema = z
  .object({
    username: z.optional(
      z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(15, { message: "Username cant exceed 15 characters" })
    ),
    password: z.optional(
      z
        .string()
        .min(6, { message: "Pasword must be at least 6 characters long" })
        .max(50, { message: "Pasword cant exceed 50 characters" })
    ),
    confirmPassword: z.optional(
      z
        .string()
        .min(6, { message: "Pasword must be at least 6 characters long" })
        .max(50, { message: "Pasword cant exceed 50 characters" })
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
