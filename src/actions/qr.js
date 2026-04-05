"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function generateQRCode() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Profile required");

  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const profileUrl = `${baseUrl}/${profile.slug}`;

  const dataUrl = await QRCode.toDataURL(profileUrl, {
    width: 512,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return { dataUrl, profileUrl };
}
