import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as spacingDefault from "./sections/spacing-default";
import * as radiusDefault from "./sections/radius-default";
import * as shadowDefault from "./sections/shadow-default";
import * as motionDefault from "./sections/motion-default";
import * as borderDefault from "./sections/border-default";
import * as breakpointDefault from "./sections/breakpoint-default";
import * as fontDefault from "./sections/font-default";
import * as coloursLifesg from "./sections/colours-lifesg";
import * as themesDark from "./sections/themes-dark-mode";

export interface Leaf {
  kind: "leaf";
  slug: string;
  title: string;
  Ours: ComponentType | null;
  LifeSG: ComponentType | null;
  Prose?: ComponentType;
}

export interface Folder {
  kind: "folder";
  slug: string;
  title: string;
  children: Leaf[];
}

export type Node = Leaf | Folder;

const leaf = (slug: string, title: string, panes: { Ours?: ComponentType; LifeSG?: ComponentType; Prose?: ComponentType } = {}): Leaf => ({
  kind: "leaf",
  slug,
  title,
  Ours: panes.Ours ?? null,
  LifeSG: panes.LifeSG ?? null,
  Prose: panes.Prose,
});

const folder = (slug: string, title: string, children: Leaf[]): Folder => ({
  kind: "folder", slug, title, children,
});

export const tree: Node[] = [
  leaf("introduction", "Introduction", { Prose: prose.IntroductionRoot }),
  folder("themes", "Themes", [
    leaf("introduction",  "Introduction",   { Prose: prose.ThemesIntro }),
    leaf("advanced-usage","Advanced usage", { Prose: prose.ThemesAdvanced }),
    leaf("dark-mode",     "Dark mode",      { Ours: themesDark.OursPane, LifeSG: themesDark.LifeSGPane }),
  ]),
  folder("colours", "Colours", [
    leaf("introduction", "Introduction", { Prose: prose.ColoursIntro }),
    leaf("lifesg",       "LifeSG",       { Ours: coloursLifesg.OursPane, LifeSG: coloursLifesg.LifeSGPane }),
  ]),
  folder("font", "Font", [
    leaf("introduction", "Introduction", { Prose: prose.FontIntro }),
    leaf("default",      "Default",      { Ours: fontDefault.OursPane, LifeSG: fontDefault.LifeSGPane }),
  ]),
  folder("breakpoint", "Breakpoint", [
    leaf("introduction", "Introduction", { Prose: prose.BreakpointIntro }),
    leaf("default",      "Default",      { Ours: breakpointDefault.OursPane, LifeSG: breakpointDefault.LifeSGPane }),
  ]),
  folder("spacing", "Spacing", [
    leaf("introduction", "Introduction", { Prose: prose.SpacingIntro }),
    leaf("default",      "Default",      { Ours: spacingDefault.OursPane, LifeSG: spacingDefault.LifeSGPane }),
  ]),
  folder("motion", "Motion", [
    leaf("introduction", "Introduction", { Prose: prose.MotionIntro }),
    leaf("default",      "Default",      { Ours: motionDefault.OursPane, LifeSG: motionDefault.LifeSGPane }),
  ]),
  folder("radius", "Radius", [
    leaf("introduction", "Introduction", { Prose: prose.RadiusIntro }),
    leaf("default",      "Default",      { Ours: radiusDefault.OursPane, LifeSG: radiusDefault.LifeSGPane }),
  ]),
  folder("border", "Border", [
    leaf("introduction", "Introduction", { Prose: prose.BorderIntro }),
    leaf("default",      "Default",      { Ours: borderDefault.OursPane, LifeSG: borderDefault.LifeSGPane }),
  ]),
  folder("component-tokens", "Component tokens", [
    leaf("introduction", "Introduction", { Prose: prose.ComponentTokensIntro }),
  ]),
  folder("shadow", "Shadow", [
    leaf("introduction", "Introduction", { Prose: prose.ShadowIntro }),
    leaf("default",      "Default",      { Ours: shadowDefault.OursPane, LifeSG: shadowDefault.LifeSGPane }),
  ]),
];

/* Pre-compute lookup map keyed by URL path segments joined with "/". */
function flattenLeaves(): Map<string, { leaf: Leaf; breadcrumb: string[] }> {
  const map = new Map<string, { leaf: Leaf; breadcrumb: string[] }>();
  for (const node of tree) {
    if (node.kind === "leaf") {
      map.set(node.slug, { leaf: node, breadcrumb: [node.title] });
    } else {
      for (const child of node.children) {
        map.set(`${node.slug}/${child.slug}`, { leaf: child, breadcrumb: [node.title, child.title] });
      }
    }
  }
  return map;
}

export const leafByPath = flattenLeaves();

/* First-leaf-of-folder helper for folder URLs that need to redirect to a real page. */
export function firstLeafOf(folderSlug: string): string | null {
  const node = tree.find((n) => n.slug === folderSlug);
  if (!node || node.kind !== "folder" || node.children.length === 0) return null;
  return `${folderSlug}/${node.children[0].slug}`;
}

export function allLeafPaths(): string[] {
  return Array.from(leafByPath.keys());
}
