import { defineConfig } from "drizzle-kit";

export const dbFile = process.env.DB_FILE
  ? process.env.DB_FILE
  : process.env.NODE_ENV === "production"
    ? "/app/data/jellyhub.db"
    : "jellyhub.db";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbFile,
  },
});
