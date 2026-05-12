import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as customFieldDefault from "./sections/custom-field-default";
import * as inputDefault from "./sections/input-default";
import * as textareaDefault from "./sections/textarea-default";
import * as maskedInputDefault from "./sections/masked-input-default";
import * as inputGroupDefault from "./sections/input-group-default";
import * as phoneNumberInputDefault from "./sections/phone-number-input-default";
import * as unitNumberInputDefault from "./sections/unit-number-input-default";
import * as dateInputDefault from "./sections/date-input-default";
import * as dateRangeInputDefault from "./sections/date-range-input-default";
import * as selectDefault from "./sections/select-default";
import * as multiSelectDefault from "./sections/multi-select-default";

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
  leaf("introduction", "Introduction", { Prose: prose.FormIntro }),
  folder("field", "Field", [
    leaf("introduction", "Introduction", { Prose: prose.FieldIntro }),
  ]),
  folder("custom-field", "CustomField", [
    leaf("introduction", "Introduction", { Prose: prose.CustomFieldIntro }),
    leaf("default",      "Default",      { Ours: customFieldDefault.OursPane, LifeSG: customFieldDefault.LifeSGPane }),
  ]),
  folder("input", "Input", [
    leaf("introduction", "Introduction", { Prose: prose.InputIntro }),
    leaf("default",      "Default",      { Ours: inputDefault.OursPane, LifeSG: inputDefault.LifeSGPane }),
  ]),
  folder("textarea", "Textarea", [
    leaf("introduction", "Introduction", { Prose: prose.TextareaIntro }),
    leaf("default",      "Default",      { Ours: textareaDefault.OursPane, LifeSG: textareaDefault.LifeSGPane }),
  ]),
  folder("masked-input", "MaskedInput", [
    leaf("introduction", "Introduction", { Prose: prose.MaskedInputIntro }),
    leaf("default",      "Default",      { Ours: maskedInputDefault.OursPane, LifeSG: maskedInputDefault.LifeSGPane }),
  ]),
  folder("input-group", "InputGroup", [
    leaf("introduction", "Introduction", { Prose: prose.InputGroupIntro }),
    leaf("default",      "Default",      { Ours: inputGroupDefault.OursPane, LifeSG: inputGroupDefault.LifeSGPane }),
  ]),
  folder("phone-number-input", "PhoneNumberInput", [
    leaf("introduction", "Introduction", { Prose: prose.PhoneNumberInputIntro }),
    leaf("default",      "Default",      { Ours: phoneNumberInputDefault.OursPane, LifeSG: phoneNumberInputDefault.LifeSGPane }),
  ]),
  folder("unit-number-input", "UnitNumberInput", [
    leaf("introduction", "Introduction", { Prose: prose.UnitNumberInputIntro }),
    leaf("default",      "Default",      { Ours: unitNumberInputDefault.OursPane, LifeSG: unitNumberInputDefault.LifeSGPane }),
  ]),
  folder("date-input", "DateInput", [
    leaf("introduction", "Introduction", { Prose: prose.DateInputIntro }),
    leaf("default",      "Default",      { Ours: dateInputDefault.OursPane, LifeSG: dateInputDefault.LifeSGPane }),
  ]),
  folder("date-range-input", "DateRangeInput", [
    leaf("introduction", "Introduction", { Prose: prose.DateRangeInputIntro }),
    leaf("default",      "Default",      { Ours: dateRangeInputDefault.OursPane, LifeSG: dateRangeInputDefault.LifeSGPane }),
  ]),
  folder("select", "Select", [
    leaf("introduction", "Introduction", { Prose: prose.SelectIntro }),
    leaf("default",      "Default",      { Ours: selectDefault.OursPane, LifeSG: selectDefault.LifeSGPane }),
  ]),
  folder("multi-select", "MultiSelect", [
    leaf("introduction", "Introduction", { Prose: prose.MultiSelectIntro }),
    leaf("default",      "Default",      { Ours: multiSelectDefault.OursPane, LifeSG: multiSelectDefault.LifeSGPane }),
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
