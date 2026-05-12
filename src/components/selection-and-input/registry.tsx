import type { ComponentType } from "react";
import * as prose from "./sections/prose";
import * as buttonDefault from "./sections/button-default";
import * as checkboxDefault from "./sections/checkbox-default";
import * as radioButtonDefault from "./sections/radio-button-default";
import * as toggleDefault from "./sections/toggle-default";
import * as iconButtonDefault from "./sections/icon-button-default";
import * as imageButtonDefault from "./sections/image-button-default";
import * as otpInputDefault from "./sections/otp-input-default";
import * as feedbackRatingDefault from "./sections/feedback-rating-default";
import * as dateNavigatorDefault from "./sections/date-navigator-default";
import * as calendarDefault from "./sections/calendar-default";
import * as filterDefault from "./sections/filter-default";

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
  folder("otp-input", "OtpInput", [
    leaf("introduction", "Introduction", { Prose: prose.OtpInputIntro }),
    leaf("default",      "Default",      { Ours: otpInputDefault.OursPane, LifeSG: otpInputDefault.LifeSGPane }),
  ]),
  folder("feedback-rating", "FeedbackRating", [
    leaf("introduction", "Introduction", { Prose: prose.FeedbackRatingIntro }),
    leaf("default",      "Default",      { Ours: feedbackRatingDefault.OursPane, LifeSG: feedbackRatingDefault.LifeSGPane }),
  ]),
  folder("date-navigator", "DateNavigator", [
    leaf("introduction", "Introduction", { Prose: prose.DateNavigatorIntro }),
    leaf("default",      "Default",      { Ours: dateNavigatorDefault.OursPane, LifeSG: dateNavigatorDefault.LifeSGPane }),
  ]),
  folder("calendar", "Calendar", [
    leaf("introduction", "Introduction", { Prose: prose.CalendarIntro }),
    leaf("default",      "Default",      { Ours: calendarDefault.OursPane, LifeSG: calendarDefault.LifeSGPane }),
  ]),
  folder("filter", "Filter", [
    leaf("introduction", "Introduction", { Prose: prose.FilterIntro }),
    leaf("default",      "Default",      { Ours: filterDefault.OursPane, LifeSG: filterDefault.LifeSGPane }),
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
