import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/lib/analytics";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { StatCard } from "@/components/analytics/stat-card";
import { TimelineChart } from "@/components/analytics/timeline-chart";
import { BarChart } from "@/components/analytics/bar-chart";
import { DeviceChart } from "@/components/analytics/device-chart";

export const metadata = {
  title: "Analytics | Linksy",
};

export default async function UserAnalyticsPage({ searchParams }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { links: { select: { id: true } } },
  });

  if (!profile) redirect("/profile");

  const { from, to } = await searchParams;
  const linkIds = profile.links.map((l) => l.id);
  const data = await getAnalytics(linkIds, from || "", to || "");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <Suspense>
          <DateRangePicker />
        </Suspense>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Clicks" value={data.totalClicks} />
        <StatCard label="Unique Visitors" value={data.uniqueVisitors} />
        <StatCard label="Top Referrer" value={data.topReferrer} />
        <StatCard label="Top Link" value={data.topLink} />
      </div>

      <div className="mb-6">
        <TimelineChart title="Clicks Over Time" data={data.timeline} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="Top Links" items={data.topLinks} />
        <DeviceChart title="Devices" items={data.devices} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="Browsers" items={data.browsers} />
        <BarChart title="Operating Systems" items={data.operatingSystems} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="Referrers" items={data.referrers} />
        <BarChart title="Languages" items={data.languages} />
      </div>

      {data.countries.length > 0 && (
        <div className="mt-4">
          <BarChart title="Countries" items={data.countries} />
        </div>
      )}
    </div>
  );
}
