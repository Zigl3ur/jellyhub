import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters long" })
    .max(15, { error: "Username cant exceed 15 characters" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(50, { error: "Password cant exceed 50 characters" }),
});

export type loginSchemaType = z.output<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "Username must be at least 3 characters long" })
      .max(15, { error: "Username cant exceed 15 characters" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" })
      .max(50, { error: "Password cant exceed 50 characters" }),
    confirmPassword: z
      .string()
      .min(6, { error: "Password must be at least 6 characters long" })
      .max(50, { error: "Password cant exceed 50 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

export type registerSchemaType = z.output<typeof registerSchema>;
