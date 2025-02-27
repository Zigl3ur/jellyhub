import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const passwd = await bcrypt.hash("adminadmin", 10);

  const existingAdmin = await prisma.accounts.findUnique({
    where: { username: "admin" },
  });

  const admin =
    existingAdmin ||
    (await prisma.accounts.create({
      data: {
        username: "admin",
        password: passwd,
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
