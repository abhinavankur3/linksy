import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/public/profile-card";
import { LinkButton } from "@/components/public/link-button";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = await prisma.profile.findUnique({ where: { slug } });
  if (!profile) return {};

  return {
    title: `${profile.displayName} | Linksy`,
    description: profile.bio || `${profile.displayName}'s links`,
    openGraph: {
      title: profile.displayName,
      description: profile.bio || undefined,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { slug } = await params;

  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: {
      links: {
        where: { active: true },
        orderBy: { position: "asc" },
      },
      user: { select: { disabled: true } },
    },
  });

  if (!profile || profile.user.disabled) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <ProfileCard profile={profile} />
        <div className="mt-6 space-y-3">
          {profile.links.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>
        <footer className="mt-8 text-center text-xs text-gray-400">
          Powered by Linksy
        </footer>
      </div>
    </div>
  );
}
