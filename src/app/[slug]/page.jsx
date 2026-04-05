import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTheme } from "@/lib/themes";
import { getLayoutComponent } from "@/components/public/layouts";
import { organizeLinksIntoGroups } from "@/lib/group-links";

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
      linkGroups: {
        orderBy: { position: "asc" },
      },
      user: { select: { disabled: true } },
    },
  });

  if (!profile || profile.user.disabled) notFound();

  const theme = getTheme(profile.theme);
  const LayoutComponent = getLayoutComponent(theme.layout);
  const { sections } = organizeLinksIntoGroups(
    profile.links,
    profile.linkGroups,
    profile.ungroupedPosition
  );

  const bgStyle = theme.vars["--bg"]?.includes("gradient")
    ? { background: theme.vars["--bg"] }
    : { backgroundColor: theme.vars["--bg"] };

  return (
    <div
      style={{ ...theme.vars, ...bgStyle, minHeight: "100vh" }}
    >
      <LayoutComponent
        profile={profile}
        sections={sections}
      />
    </div>
  );
}
