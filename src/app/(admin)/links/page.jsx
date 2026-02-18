import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LinkList } from "@/components/links/link-list";

export const metadata = {
  title: "Links | Linksy",
};

export default async function LinksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      links: {
        orderBy: { position: "asc" },
        include: {
          _count: { select: { clicks: true } },
        },
      },
    },
  });

  if (!profile) redirect("/profile");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Links</h1>
        <a
          href={`/${profile.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View public page
        </a>
      </div>
      <LinkList links={profile.links} />
    </div>
  );
}
