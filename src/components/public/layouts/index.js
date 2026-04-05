import { ClassicLayout } from "./classic-layout";
import { CardLayout } from "./card-layout";
import { CoverLayout } from "./cover-layout";

const LAYOUTS = {
  classic: ClassicLayout,
  card: CardLayout,
  cover: CoverLayout,
};

export function getLayoutComponent(layoutName) {
  return LAYOUTS[layoutName] || ClassicLayout;
}
