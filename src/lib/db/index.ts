import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./schema";
import { dbFile } from "../../../drizzle.config";

const db = drizzle(dbFile, {
  relations,
});

db.$client.run("PRAGMA foreign_keys = ON");

export default db;
