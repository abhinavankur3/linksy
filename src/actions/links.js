"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { detectIconFromUrl } from "@/lib/icons";

async function getProfileForUser(userId) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("Profile required");
  return profile;
}

async function verifyLinkOwnership(linkId, userId) {
  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { profile: true },
  });
  if (!link || link.profile.userId !== userId) {
    throw new Error("Not found or unauthorized");
  }
  return link;
}

export async function createLink(formData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);
  const title = formData.get("title");
  const url = formData.get("url");

  if (!title || !url) {
    return { error: "Title and URL are required." };
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { error: "URL must start with http:// or https://" };
  }

  const maxLink = await prisma.link.findFirst({
    where: { profileId: profile.id },
    orderBy: { position: "desc" },
  });

  // Use explicitly set icon, or auto-detect from URL
  const iconValue = formData.get("icon");
  const icon = iconValue || detectIconFromUrl(url) || null;

  const link = await prisma.link.create({
    data: {
      profileId: profile.id,
      title,
      url,
      icon,
      position: (maxLink?.position ?? -1) + 1,
    },
  });

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true, link };
}

export async function updateLink(linkId, formData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const link = await verifyLinkOwnership(linkId, session.user.id);
  const title = formData.get("title");
  const url = formData.get("url");

  if (!title || !url) {
    return { error: "Title and URL are required." };
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { error: "URL must start with http:// or https://" };
  }

  const iconValue = formData.get("icon");
  const icon = iconValue || detectIconFromUrl(url) || null;

  await prisma.link.update({
    where: { id: linkId },
    data: { title, url, icon },
  });

  revalidatePath("/links");
  revalidatePath(`/${link.profile.slug}`);

  return { success: true };
}

export async function deleteLink(linkId) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const link = await verifyLinkOwnership(linkId, session.user.id);

  await prisma.link.delete({ where: { id: linkId } });

  revalidatePath("/links");
  revalidatePath(`/${link.profile.slug}`);

  return { success: true };
}

export async function toggleLink(linkId) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const link = await verifyLinkOwnership(linkId, session.user.id);

  await prisma.link.update({
    where: { id: linkId },
    data: { active: !link.active },
  });

  revalidatePath("/links");
  revalidatePath(`/${link.profile.slug}`);

  return { success: true };
}

export async function reorderLinks(orderedIds) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);

  // Verify all links belong to this profile
  const links = await prisma.link.findMany({
    where: { profileId: profile.id },
  });
  const linkIds = new Set(links.map((l) => l.id));
  for (const id of orderedIds) {
    if (!linkIds.has(id)) throw new Error("Invalid link ID in order");
  }

  // Update all positions in a transaction
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.link.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true };
}
