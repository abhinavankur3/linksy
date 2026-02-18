import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD not set, skipping seed.");
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin user already exists, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      profile: {
        create: {
          displayName: "Admin",
          slug: "admin",
          bio: "Site administrator",
        },
      },
    },
    include: { profile: true },
  });

  console.log(
    `Admin user created: ${admin.email} (profile slug: ${admin.profile?.slug})`
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
