import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await auth.api.createUser({
      body: {
        email: "admin@jellyhub.com",
        name: "admin",
        password: "adminadmin",
        role: "admin",
        data: {
          username: "admin",
        },
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
