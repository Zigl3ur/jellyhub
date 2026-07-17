import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./schema";

const db = drizzle(process.env.DB_FILE as string, {
  relations,
});

export default db;
