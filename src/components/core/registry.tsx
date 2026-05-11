import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as typographyDefault from "./sections/typography-default";
import * as layoutDefault from "./sections/layout-default";
import * as dividerDefault from "./sections/divider-default";
import * as iconDefault from "./sections/icon-default";
import * as errorDisplayDefault from "./sections/errordisplay-default";
import * as markupDefault from "./sections/markup-default";
import * as textlistDefault from "./sections/textlist-default";

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
  leaf("introduction", "Introduction", { Prose: prose.CoreIntro }),
  folder("typography", "Typography", [
    leaf("introduction", "Introduction", { Prose: prose.TypographyIntro }),
    leaf("default",      "Default",      { Ours: typographyDefault.OursPane, LifeSG: typographyDefault.LifeSGPane }),
  ]),
  folder("layout", "Layout", [
    leaf("introduction", "Introduction", { Prose: prose.LayoutIntro }),
    leaf("default",      "Default",      { Ours: layoutDefault.OursPane, LifeSG: layoutDefault.LifeSGPane }),
  ]),
  folder("divider", "Divider", [
    leaf("introduction", "Introduction", { Prose: prose.DividerIntro }),
    leaf("default",      "Default",      { Ours: dividerDefault.OursPane, LifeSG: dividerDefault.LifeSGPane }),
  ]),
  folder("icon", "Icon", [
    leaf("introduction", "Introduction", { Prose: prose.IconIntro }),
    leaf("default",      "Default",      { Ours: iconDefault.OursPane, LifeSG: iconDefault.LifeSGPane }),
  ]),
  folder("error-display", "ErrorDisplay", [
    leaf("introduction", "Introduction", { Prose: prose.ErrorDisplayIntro }),
    leaf("default",      "Default",      { Ours: errorDisplayDefault.OursPane, LifeSG: errorDisplayDefault.LifeSGPane }),
  ]),
  folder("markup", "Markup", [
    leaf("introduction", "Introduction", { Prose: prose.MarkupIntro }),
    leaf("default",      "Default",      { Ours: markupDefault.OursPane, LifeSG: markupDefault.LifeSGPane }),
  ]),
  folder("text-list", "TextList", [
    leaf("introduction", "Introduction", { Prose: prose.TextListIntro }),
    leaf("default",      "Default",      { Ours: textlistDefault.OursPane, LifeSG: textlistDefault.LifeSGPane }),
  ]),
];

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

export function firstLeafOf(folderSlug: string): string | null {
  const node = tree.find((n) => n.slug === folderSlug);
  if (!node || node.kind !== "folder" || node.children.length === 0) return null;
  return `${folderSlug}/${node.children[0].slug}`;
}

export function allLeafPaths(): string[] {
  return Array.from(leafByPath.keys());
}
