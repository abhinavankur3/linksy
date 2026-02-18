"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isValidSlug } from "@/lib/slug";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { MAX_AVATAR_SIZE, ALLOWED_AVATAR_TYPES } from "@/lib/constants";

export async function updateProfile(formData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const displayName = formData.get("displayName");
  const bio = formData.get("bio") || "";
  const slug = formData.get("slug");
  const avatar = formData.get("avatar");

  if (!displayName || !slug) {
    return { error: "Display name and slug are required." };
  }

  if (!isValidSlug(slug)) {
    return {
      error:
        "Slug must be 3-48 characters, lowercase alphanumeric and hyphens, and cannot be a reserved word.",
    };
  }

  // Check slug uniqueness (excluding own profile)
  const existing = await prisma.profile.findFirst({
    where: { slug, NOT: { userId: session.user.id } },
  });
  if (existing) {
    return { error: "This slug is already taken." };
  }

  let avatarPath;

  if (avatar && avatar.size > 0) {
    if (avatar.size > MAX_AVATAR_SIZE) {
      return { error: "Avatar must be under 2MB." };
    }
    if (!ALLOWED_AVATAR_TYPES.includes(avatar.type)) {
      return { error: "Avatar must be JPEG, PNG, WebP, or GIF." };
    }

    const uploadDir = process.env.UPLOAD_DIR || "./uploads";
    await mkdir(uploadDir, { recursive: true });

    const ext = avatar.name.split(".").pop() || "jpg";
    const filename = `${session.user.id}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await avatar.arrayBuffer());
    await writeFile(filepath, buffer);

    avatarPath = filename;
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      displayName,
      bio,
      slug,
      ...(avatarPath && { avatarPath }),
    },
    create: {
      userId: session.user.id,
      displayName,
      bio,
      slug,
      avatarPath: avatarPath || null,
    },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/profile");

  return { success: true, profile };
}
