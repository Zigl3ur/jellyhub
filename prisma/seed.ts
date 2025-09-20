import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  try {
    const userAdmin = await prisma.user.create({
      data: {
        name: "admin",
        email: "admin@jellyhub.com",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        displayUsername: "data",
        role: "admin",
        username: "admin",
      },
    });
    await prisma.account.create({
      data: {
        providerId: "credential",
        userId: userAdmin.id,
        password:
          "780e41f424689577e7aa16634300fb94:56d0c9158d993ed8f3500587ae846f52293dc136425be5c96bc47fef881c81ecf2b18fa5280d96ed9b4638917359601f171bcd615c5f891d78d6218b0b2a29cb",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("Admin user created successfully");
  } catch {
    console.log("Admin user already exists skipping...");
  }
}

main().then(async () => {
  await prisma.$disconnect();
});
