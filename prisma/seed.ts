import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.accounts.findUnique({
    where: { username: "admin" },
  });

  const admin =
    existingAdmin ||
    (await prisma.accounts.create({
      data: {
        username: "admin",
        password:
          "$2b$10$IJDaNi5DnLfcsJh47Y9A5ucuzHh6r7n8mAak4vP30V3DBjBC8DDte", // adminadmin
        admin: true,
      },
    }));

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
