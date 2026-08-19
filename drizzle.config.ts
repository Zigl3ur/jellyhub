import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? "/app/data/jellyhub.db"
        : "jellyhub.db",
  },
});
