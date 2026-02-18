"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { isValidSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Forbidden: admin access required");
  }
  return session;
}

export async function createUser(formData) {
  await requireAdmin();

  const email = formData.get("email");
  const password = formData.get("password");
  const displayName = formData.get("displayName");
  const slug = formData.get("slug");

  if (!email || !password || !displayName || !slug) {
    return { error: "All fields are required." };
  }

  if (!isValidSlug(slug)) {
    return {
      error: "Slug must be 3-48 chars, lowercase alphanumeric and hyphens.",
    };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return { error: "Email already exists." };

  const existingSlug = await prisma.profile.findUnique({ where: { slug } });
  if (existingSlug) return { error: "Slug already taken." };

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "user",
      profile: {
        create: {
          displayName,
          slug,
          bio: "",
        },
      },
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserDisabled(userId) {
  const session = await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  if (user.id === session.user.id) {
    return { error: "Cannot disable your own account." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { disabled: !user.disabled },
  });

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (profile) {
    revalidatePath(`/${profile.slug}`);
  }

  revalidatePath("/admin/users");
  return { success: true, disabled: !user.disabled };
}
