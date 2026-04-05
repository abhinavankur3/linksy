"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getProfileForUser(userId) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("Profile required");
  return profile;
}

export async function createLinkGroup(formData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);
  const name = formData.get("name");

  if (!name || !name.trim()) {
    return { error: "Group name is required." };
  }

  const maxGroup = await prisma.linkGroup.findFirst({
    where: { profileId: profile.id },
    orderBy: { position: "desc" },
  });

  const group = await prisma.linkGroup.create({
    data: {
      profileId: profile.id,
      name: name.trim(),
      position: (maxGroup?.position ?? -1) + 1,
    },
  });

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true, group };
}

export async function updateLinkGroup(groupId, formData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);
  const group = await prisma.linkGroup.findUnique({ where: { id: groupId } });

  if (!group || group.profileId !== profile.id) {
    throw new Error("Not found or unauthorized");
  }

  const name = formData.get("name");
  if (!name || !name.trim()) {
    return { error: "Group name is required." };
  }

  await prisma.linkGroup.update({
    where: { id: groupId },
    data: { name: name.trim() },
  });

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true };
}

export async function deleteLinkGroup(groupId) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);
  const group = await prisma.linkGroup.findUnique({ where: { id: groupId } });

  if (!group || group.profileId !== profile.id) {
    throw new Error("Not found or unauthorized");
  }

  // Links in this group will have groupId set to null (onDelete: SetNull)
  await prisma.linkGroup.delete({ where: { id: groupId } });

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true };
}

export async function reorderSections(orderedSectionIds) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await getProfileForUser(session.user.id);

  const groups = await prisma.linkGroup.findMany({
    where: { profileId: profile.id },
  });
  const groupIds = new Set(groups.map((g) => g.id));

  let ungroupedPosition = 0;
  const groupUpdates = [];

  for (let i = 0; i < orderedSectionIds.length; i++) {
    const id = orderedSectionIds[i];
    if (id === "__ungrouped__") {
      ungroupedPosition = i;
    } else {
      if (!groupIds.has(id)) throw new Error("Invalid group ID in order");
      groupUpdates.push(
        prisma.linkGroup.update({
          where: { id },
          data: { position: i },
        })
      );
    }
  }

  await prisma.$transaction([
    ...groupUpdates,
    prisma.profile.update({
      where: { id: profile.id },
      data: { ungroupedPosition },
    }),
  ]);

  revalidatePath("/links");
  revalidatePath(`/${profile.slug}`);

  return { success: true };
}
