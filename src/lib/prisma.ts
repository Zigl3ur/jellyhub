import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const isDevEnv = process.env.NODE_ENV !== "production";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: isDevEnv ? ["warn", "error"] : [],
  });

if (isDevEnv) globalForPrisma.prisma = prisma;
