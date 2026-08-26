import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import db from ".";

migrate(db, { migrationsFolder: "./drizzle" });
