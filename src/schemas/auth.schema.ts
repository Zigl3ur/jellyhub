import { z } from "zod";

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
