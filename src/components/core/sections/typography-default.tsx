"use client";

import { Typography as OurTypography } from "@/components/ui/typography";
import { Typography as LifeSGTypography } from "@lifesg/react-design-system/typography";
import type { ComponentType, ReactNode } from "react";

type Row = { id: string; label: string; sample: string };
const headingRows: Row[] = [
  { id: "heading-xxl", label: "HeadingXXL", sample: "The quick brown fox" },
  { id: "heading-xl",  label: "HeadingXL",  sample: "The quick brown fox" },
  { id: "heading-lg",  label: "HeadingLG",  sample: "The quick brown fox" },
  { id: "heading-md",  label: "HeadingMD",  sample: "The quick brown fox" },
  { id: "heading-sm",  label: "HeadingSM",  sample: "The quick brown fox" },
  { id: "heading-xs",  label: "HeadingXS",  sample: "The quick brown fox" },
];
const bodyRows: Row[] = [
  { id: "body-bl", label: "BodyBL", sample: "Sphinx of black quartz, judge my vow." },
  { id: "body-md", label: "BodyMD", sample: "Sphinx of black quartz, judge my vow." },
  { id: "body-sm", label: "BodySM", sample: "Sphinx of black quartz, judge my vow." },
  { id: "body-xs", label: "BodyXS", sample: "Sphinx of black quartz, judge my vow." },
];

function RowFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 py-2 border-b border-border last:border-0">
      <code className="text-xs text-muted-foreground w-32 shrink-0">{label}</code>
      <div data-token={label} className="min-w-0">{children}</div>
    </div>
  );
}

function OursSection() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-3">Heading scale</h3>
        {headingRows.map((r) => (
          <RowFrame key={r.id} label={r.label}>
            <OurTypography variant={r.id as never} weight="semibold">{r.sample}</OurTypography>
          </RowFrame>
        ))}
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Body scale</h3>
        {bodyRows.map((r) => (
          <RowFrame key={r.id} label={r.label}>
            <OurTypography variant={r.id as never}>{r.sample}</OurTypography>
          </RowFrame>
        ))}
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Weights (BodyMD)</h3>
        {(["light", "regular", "semibold", "bold"] as const).map((w) => (
          <RowFrame key={w} label={w}>
            <OurTypography variant="body-md" weight={w}>The quick brown fox</OurTypography>
          </RowFrame>
        ))}
      </section>
    </div>
  );
}

function LifeSGSection() {
  const T = LifeSGTypography as unknown as Record<string, ComponentType<{ children: ReactNode; weight?: string }>>;
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-sm font-semibold mb-3">Heading scale</h3>
        {headingRows.map((r) => {
          const key = r.label;
          const C = T[key];
          return (
            <RowFrame key={r.id} label={r.label}>
              <C weight="semibold">{r.sample}</C>
            </RowFrame>
          );
        })}
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Body scale</h3>
        {bodyRows.map((r) => {
          const C = T[r.label];
          return (
            <RowFrame key={r.id} label={r.label}>
              <C>{r.sample}</C>
            </RowFrame>
          );
        })}
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-3">Weights (BodyMD)</h3>
        {(["light", "regular", "semibold", "bold"] as const).map((w) => {
          const C = T["BodyMD"];
          return (
            <RowFrame key={w} label={w}>
              <C weight={w}>The quick brown fox</C>
            </RowFrame>
          );
        })}
      </section>
    </div>
  );
}

export const OursPane = OursSection;
export const LifeSGPane = LifeSGSection;
