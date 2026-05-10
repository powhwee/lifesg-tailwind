import type { ComponentType } from "react";
import { ButtonShadcnCases, ButtonLifeSGCases } from "./cases/button";

export interface ComparisonEntry {
  slug: string;
  title: string;
  Shadcn: ComponentType;
  LifeSG: ComponentType;
}

export const comparisons: ComparisonEntry[] = [
  {
    slug: "button",
    title: "Button",
    Shadcn: ButtonShadcnCases,
    LifeSG: ButtonLifeSGCases,
  },
];

export const comparisonBySlug = new Map(comparisons.map((c) => [c.slug, c]));
