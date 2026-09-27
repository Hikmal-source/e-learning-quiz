import { PrismaClient } from "@/app/generated/prisma";
import { hashPassword } from "@/libs/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@devlearn.local";
  const name = "DevLearn Admin";

  const password = "Admin123$";

  const hashedPassword = await hashPassword(password);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: "ADMIN",
        password: hashedPassword,
        name,
      },
    });

    console.log("Admin updated:");
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:");
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((error) => {
    console.error("CREATE_ADMIN_ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });