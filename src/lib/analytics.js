import { prisma } from "@/lib/prisma";

function dateFilter(from, to) {
  const filter = {};
  if (from) filter.gte = new Date(from + "T00:00:00.000Z");
  if (to) filter.lte = new Date(to + "T23:59:59.999Z");
  return Object.keys(filter).length > 0 ? filter : undefined;
}

export async function getAnalytics(linkIds, from, to) {
  if (!linkIds.length) return emptyAnalytics();

  const where = {
    linkId: { in: linkIds },
    clickedAt: dateFilter(from, to),
  };

  const [
    totalClicks,
    uniqueVisitors,
    topLinksRaw,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    referrerBreakdown,
    languageBreakdown,
    countryBreakdown,
  ] = await Promise.all([
    prisma.click.count({ where }),
    prisma.click.groupBy({
      by: ["hashedIp"],
      where,
    }).then((r) => r.length),
    prisma.click.groupBy({
      by: ["linkId"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    groupByField("deviceType", where),
    groupByField("browser", where),
    groupByField("os", where),
    groupByField("referrerDomain", where),
    groupByField("language", where),
    groupByField("country", where),
  ]);

  // Enrich top links with titles
  const linkMap = await prisma.link.findMany({
    where: { id: { in: topLinksRaw.map((r) => r.linkId) } },
    select: { id: true, title: true, url: true },
  }).then((links) => Object.fromEntries(links.map((l) => [l.id, l])));

  const topLinks = topLinksRaw.map((r) => ({
    label: linkMap[r.linkId]?.title || "Deleted link",
    value: r._count.id,
    url: linkMap[r.linkId]?.url || "",
  }));

  // Clicks over time (raw SQL for date grouping)
  // Prisma stores DateTime as Unix milliseconds in SQLite
  const clickedAtFilter = dateFilter(from, to);
  const timelineParams = [...linkIds];
  let timelineSQL = `
    SELECT strftime('%Y-%m-%d', clickedAt / 1000, 'unixepoch') as date, COUNT(*) as count
    FROM Click
    WHERE linkId IN (${linkIds.map(() => "?").join(",")})
  `;
  if (clickedAtFilter?.gte) {
    timelineSQL += ` AND clickedAt >= ?`;
    timelineParams.push(clickedAtFilter.gte.getTime());
  }
  if (clickedAtFilter?.lte) {
    timelineSQL += ` AND clickedAt <= ?`;
    timelineParams.push(clickedAtFilter.lte.getTime());
  }
  timelineSQL += ` GROUP BY date ORDER BY date`;

  const timelineRaw = await prisma.$queryRawUnsafe(timelineSQL, ...timelineParams);
  const timeline = timelineRaw.map((r) => ({
    label: r.date,
    value: Number(r.count),
  }));

  // Top referrer for summary card
  const topReferrer = referrerBreakdown.length > 0
    ? referrerBreakdown[0].label
    : "Direct";
  const topLink = topLinks.length > 0 ? topLinks[0].label : "-";

  return {
    totalClicks,
    uniqueVisitors,
    topReferrer,
    topLink,
    timeline,
    topLinks,
    devices: deviceBreakdown,
    browsers: browserBreakdown,
    operatingSystems: osBreakdown,
    referrers: referrerBreakdown,
    languages: languageBreakdown,
    countries: countryBreakdown,
  };
}

async function groupByField(field, where) {
  const results = await prisma.click.groupBy({
    by: [field],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  return results.map((r) => ({
    label: r[field] || "Unknown",
    value: r._count.id,
  }));
}

function emptyAnalytics() {
  return {
    totalClicks: 0,
    uniqueVisitors: 0,
    topReferrer: "-",
    topLink: "-",
    timeline: [],
    topLinks: [],
    devices: [],
    browsers: [],
    operatingSystems: [],
    referrers: [],
    languages: [],
    countries: [],
  };
}
