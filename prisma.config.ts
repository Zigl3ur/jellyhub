import path from "node:path";
import type { PrismaConfig } from "prisma";
import "dotenv/config";

export default {
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
  },
} satisfies PrismaConfig;
