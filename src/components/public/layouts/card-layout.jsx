import { ProfileCard } from "../profile-card";
import { SectionList } from "./section-list";

export function CardLayout({ profile, sections }) {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12">
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <ProfileCard profile={profile} />
        <div className="mt-6">
          <SectionList sections={sections} />
        </div>
        <footer
          className="mt-8 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Powered by Linksy
        </footer>
      </div>
    </div>
  );
}
