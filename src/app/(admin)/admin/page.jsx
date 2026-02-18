import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | Linksy",
};

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/links");

  const [userCount, profileCount, linkCount, clickCount] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.link.count(),
    prisma.click.count(),
  ]);

  const stats = [
    { label: "Users", value: userCount },
    { label: "Profiles", value: profileCount },
    { label: "Links", value: linkCount },
    { label: "Total Clicks", value: clickCount },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
