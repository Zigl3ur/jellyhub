import { z } from "zod/v4";

export const addServerSchema = z.object({
  address: z.url({ message: "Please enter a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type addServerSchemaType = z.output<typeof addServerSchema>;

export const passwordSchema = z
  .string()
  .min(6, { message: "Pasword must be at least 6 characters long" })
  .max(50, { message: "Pasword cant exceed 50 characters" });
