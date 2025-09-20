import { PrismaClient } from "@/generated/prisma";

const isDevEnv = process.env.NODE_ENV !== "production";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isDevEnv ? ["warn", "error"] : [],
  });

if (isDevEnv) globalForPrisma.prisma = prisma;
