import { ProfileCard } from "../profile-card";
import { LinkButton } from "../link-button";
import { LinkGroupSection } from "../link-group-section";
import { SectionList } from "./section-list";

export function ClassicLayout({ profile, sections }) {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12">
      <div className="w-full max-w-md">
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
