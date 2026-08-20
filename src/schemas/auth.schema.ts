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

export const editUserSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "Username must be at least 3 characters long" })
      .max(15, { error: "Username can't exceed 15 characters" }),

    password: z
      .string()
      .max(50, { error: "Password can't exceed 50 characters" }),

    confirmPassword: z
      .string()
      .max(50, { error: "Password can't exceed 50 characters" }),

    role: z.union([z.literal("user"), z.literal("admin")]),

    image: z
      .string()
      .transform((val) => val.replace(/^data:image\/\w+;base64,/, ""))
      .pipe(z.base64())
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.password) {
      return;
    }

    if (data.password.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 6 characters long",
      });
    }

    if (!data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Please confirm your password",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type editUserSchemaType = z.output<typeof editUserSchema>;
