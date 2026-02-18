import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/hash";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request) {
  const linkId = request.nextUrl.searchParams.get("id");
  if (!linkId) {
    return NextResponse.json({ error: "Missing link ID" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link || !link.active) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Get IP from headers (supports reverse proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const hashedIp = hashIp(ip);

  // Rate limit: still redirect, but skip recording if over limit
  const { allowed } = rateLimit(hashedIp);

  if (allowed) {
    // Fire-and-forget: don't block the redirect
    prisma.click
      .create({
        data: {
          linkId: link.id,
          hashedIp,
        },
      })
      .catch(console.error);
  }

  return NextResponse.redirect(link.url, 302);
}
