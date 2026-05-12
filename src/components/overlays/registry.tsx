import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as modalDefault from "./sections/modal-default";
import * as popoverDefault from "./sections/popover-default";
import * as drawerDefault from "./sections/drawer-default";
import * as menuDefault from "./sections/menu-default";

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
  kind: "leaf", slug, title,
  Ours: panes.Ours ?? null, LifeSG: panes.LifeSG ?? null, Prose: panes.Prose,
});

const folder = (slug: string, title: string, children: Leaf[]): Folder => ({
  kind: "folder", slug, title, children,
});

export const tree: Node[] = [
  leaf("introduction", "Introduction", { Prose: prose.OverlaysIntro }),
  folder("modal", "Modal", [
    leaf("introduction", "Introduction", { Prose: prose.ModalIntro }),
    leaf("default",      "Default",      { Ours: modalDefault.OursPane, LifeSG: modalDefault.LifeSGPane }),
  ]),
  folder("popover", "Popover", [
    leaf("introduction", "Introduction", { Prose: prose.PopoverIntro }),
    leaf("default",      "Default",      { Ours: popoverDefault.OursPane, LifeSG: popoverDefault.LifeSGPane }),
  ]),
  folder("drawer", "Drawer", [
    leaf("introduction", "Introduction", { Prose: prose.DrawerIntro }),
    leaf("default",      "Default",      { Ours: drawerDefault.OursPane, LifeSG: drawerDefault.LifeSGPane }),
  ]),
  folder("menu", "Menu", [
    leaf("introduction", "Introduction", { Prose: prose.MenuIntro }),
    leaf("default",      "Default",      { Ours: menuDefault.OursPane, LifeSG: menuDefault.LifeSGPane }),
  ]),
  folder("modal-v2", "ModalV2", [
    leaf("introduction", "Introduction", { Prose: prose.ModalV2Intro }),
  ]),
  folder("overlay", "Overlay", [
    leaf("introduction", "Introduction", { Prose: prose.OverlayIntro }),
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
