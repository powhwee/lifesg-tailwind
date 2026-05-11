import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as buttonDefault from "./sections/button-default";
import * as checkboxDefault from "./sections/checkbox-default";
import * as radioButtonDefault from "./sections/radio-button-default";
import * as toggleDefault from "./sections/toggle-default";
import * as iconButtonDefault from "./sections/icon-button-default";
import * as imageButtonDefault from "./sections/image-button-default";

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

const leaf = (
  slug: string,
  title: string,
  panes: { Ours?: ComponentType; LifeSG?: ComponentType; Prose?: ComponentType } = {}
): Leaf => ({
  kind: "leaf",
  slug,
  title,
  Ours: panes.Ours ?? null,
  LifeSG: panes.LifeSG ?? null,
  Prose: panes.Prose,
});

const folder = (slug: string, title: string, children: Leaf[]): Folder => ({
  kind: "folder",
  slug,
  title,
  children,
});

export const tree: Node[] = [
  leaf("introduction", "Introduction", { Prose: prose.SelectionAndInputIntro }),
  folder("button", "Button", [
    leaf("introduction", "Introduction", { Prose: prose.ButtonIntro }),
    leaf("default",      "Default",      { Ours: buttonDefault.OursPane, LifeSG: buttonDefault.LifeSGPane }),
  ]),
  folder("checkbox", "Checkbox", [
    leaf("introduction", "Introduction", { Prose: prose.CheckboxIntro }),
    leaf("default",      "Default",      { Ours: checkboxDefault.OursPane, LifeSG: checkboxDefault.LifeSGPane }),
  ]),
  folder("radio-button", "RadioButton", [
    leaf("introduction", "Introduction", { Prose: prose.RadioButtonIntro }),
    leaf("default",      "Default",      { Ours: radioButtonDefault.OursPane, LifeSG: radioButtonDefault.LifeSGPane }),
  ]),
  folder("toggle", "Toggle", [
    leaf("introduction", "Introduction", { Prose: prose.ToggleIntro }),
    leaf("default",      "Default",      { Ours: toggleDefault.OursPane, LifeSG: toggleDefault.LifeSGPane }),
  ]),
  folder("icon-button", "IconButton", [
    leaf("introduction", "Introduction", { Prose: prose.IconButtonIntro }),
    leaf("default",      "Default",      { Ours: iconButtonDefault.OursPane, LifeSG: iconButtonDefault.LifeSGPane }),
  ]),
  folder("image-button", "ImageButton", [
    leaf("introduction", "Introduction", { Prose: prose.ImageButtonIntro }),
    leaf("default",      "Default",      { Ours: imageButtonDefault.OursPane, LifeSG: imageButtonDefault.LifeSGPane }),
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
