import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as cardDefault from "./sections/card-default";
import * as tableDefault from "./sections/table-default";
import * as uneditableSectionDefault from "./sections/uneditable-section-default";
import * as boxContainerDefault from "./sections/box-container-default";
import * as tabDefault from "./sections/tab-default";
import * as accordionDefault from "./sections/accordion-default";
import * as dataTableDefault from "./sections/data-table-default";
import * as ficDefault from "./sections/fullscreen-image-carousel-default";

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
  leaf("introduction", "Introduction", { Prose: prose.ContentIntro }),
  folder("accordion", "Accordion", [
    leaf("introduction", "Introduction", { Prose: prose.AccordionIntro }),
    leaf("default",      "Default",      { Ours: accordionDefault.OursPane, LifeSG: accordionDefault.LifeSGPane }),
  ]),
  folder("box-container", "BoxContainer", [
    leaf("introduction", "Introduction", { Prose: prose.BoxContainerIntro }),
    leaf("default",      "Default",      { Ours: boxContainerDefault.OursPane, LifeSG: boxContainerDefault.LifeSGPane }),
  ]),
  folder("card", "Card", [
    leaf("introduction", "Introduction", { Prose: prose.CardIntro }),
    leaf("default",      "Default",      { Ours: cardDefault.OursPane, LifeSG: cardDefault.LifeSGPane }),
  ]),
  folder("data-table", "DataTable", [
    leaf("introduction", "Introduction", { Prose: prose.DataTableIntro }),
    leaf("default",      "Default",      { Ours: dataTableDefault.OursPane, LifeSG: dataTableDefault.LifeSGPane }),
  ]),
  folder("fullscreen-image-carousel", "FullscreenImageCarousel", [
    leaf("introduction", "Introduction", { Prose: prose.FullscreenImageCarouselIntro }),
    leaf("default",      "Default",      { Ours: ficDefault.OursPane, LifeSG: ficDefault.LifeSGPane }),
  ]),
  folder("tab", "Tab", [
    leaf("introduction", "Introduction", { Prose: prose.TabIntro }),
    leaf("default",      "Default",      { Ours: tabDefault.OursPane, LifeSG: tabDefault.LifeSGPane }),
  ]),
  folder("table", "Table", [
    leaf("introduction", "Introduction", { Prose: prose.TableIntro }),
    leaf("default",      "Default",      { Ours: tableDefault.OursPane, LifeSG: tableDefault.LifeSGPane }),
  ]),
  folder("uneditable-section", "UneditableSection", [
    leaf("introduction", "Introduction", { Prose: prose.UneditableSectionIntro }),
    leaf("default",      "Default",      { Ours: uneditableSectionDefault.OursPane, LifeSG: uneditableSectionDefault.LifeSGPane }),
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
