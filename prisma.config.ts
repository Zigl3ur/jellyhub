import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: `pnpm dlx prisma db seed`,
    path: path.join("prisma", "migrations"),
  },
} satisfies PrismaConfig;
