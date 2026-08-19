import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./schema";

const dbFile =
  process.env.NODE_ENV === "production"
    ? "/app/data/jellyhub.db"
    : "jellyhub.db";

const db = drizzle(dbFile, {
  relations,
});

db.$client.run("PRAGMA foreign_keys = ON");

export default db;
