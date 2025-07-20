import { z } from "zod/v4";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username cant exceed 15 characters" }),
  password: z
    .string()
    .min(6, { message: "Pasword must be at least 6 characters long" })
    .max(50, { message: "Pasword cant exceed 50 characters" }),
});

export type loginSchemaType = z.output<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(15, { message: "Username cant exceed 15 characters" }),
    password: z
      .string()
      .min(6, { message: "Pasword must be at least 6 characters long" })
      .max(50, { message: "Pasword cant exceed 50 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Pasword must be at least 6 characters long" })
      .max(50, { message: "Pasword cant exceed 50 characters" }),
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

export type registerSchemaType = z.output<typeof registerSchema>;
