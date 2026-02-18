export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("./lib/prisma.js");
    const bcrypt = await import("bcryptjs");

    // Enable WAL mode for better concurrent read performance
    await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
    await prisma.$queryRawUnsafe("PRAGMA busy_timeout = 5000;");

    // Seed admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const existing = await prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existing) {
        try {
          const hashed = await bcrypt.hash(adminPassword, 12);
          const slug = adminEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "");
          await prisma.user.create({
            data: {
              email: adminEmail,
              password: hashed,
              role: "admin",
              profile: {
                create: {
                  displayName: "Admin",
                  slug: slug || "admin",
                  bio: "Site administrator",
                },
              },
            },
          });
          console.log(`[linksy] Admin user created: ${adminEmail}`);
        } catch (e) {
          if (e.code === "P2002") {
            console.log(`[linksy] Admin user already exists, skipping seed`);
          } else {
            throw e;
          }
        }
      }
    }
  }
}
