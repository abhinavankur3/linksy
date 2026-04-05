import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/hash";
import { rateLimit } from "@/lib/rate-limit";
import { parseClickMetadata } from "@/lib/click-meta";

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
    const meta = parseClickMetadata(request, ip);

    // Skip recording bot clicks
    if (!meta.isBot) {
      // Fire-and-forget: don't block the redirect
      prisma.click
        .create({
          data: {
            linkId: link.id,
            hashedIp,
            referrer: meta.referrer,
            referrerDomain: meta.referrerDomain,
            userAgent: meta.userAgent,
            browser: meta.browser,
            browserVersion: meta.browserVersion,
            os: meta.os,
            osVersion: meta.osVersion,
            deviceType: meta.deviceType,
            language: meta.language,
            country: meta.country,
            utmSource: meta.utmSource,
            utmMedium: meta.utmMedium,
            utmCampaign: meta.utmCampaign,
          },
        })
        .catch(console.error);
    }
  }

  return NextResponse.redirect(link.url, 302);
}
