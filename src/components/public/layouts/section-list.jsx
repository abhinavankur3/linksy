import { LinkButton } from "../link-button";
import { LinkGroupSection } from "../link-group-section";

export function SectionList({ sections }) {
  return (
    <div className="space-y-3">
      {sections.map((section) => {
        if (section.type === "ungrouped") {
          return section.data.map((link) => (
            <LinkButton key={link.id} link={link} />
          ));
        }
        return (
          <div key={section.data.id} className="mt-1">
            <LinkGroupSection group={section.data} />
          </div>
        );
      })}
    </div>
  );
}
