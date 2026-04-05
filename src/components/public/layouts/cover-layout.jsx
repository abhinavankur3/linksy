import { ProfileCard } from "../profile-card";
import { SectionList } from "./section-list";

export function CoverLayout({ profile, sections }) {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="h-40 w-full" style={{ background: "var(--bg)" }} />
      <div
        className="-mt-16 w-full max-w-md px-4 pb-12"
        style={{ color: "var(--text)" }}
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
