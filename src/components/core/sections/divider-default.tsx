"use client";

import { Divider as OurDivider } from "@/components/ui/divider";
import { Divider as LifeSGDivider } from "@lifesg/react-design-system/divider";
import type { ReactNode } from "react";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 py-3 border-b border-border last:border-0">
      <code className="text-xs text-muted-foreground" data-token={label}>{label}</code>
      <div className="w-full">{children}</div>
    </div>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col">
      <Row label="default (1px solid, border token)">
        <OurDivider />
      </Row>
      <Row label="thickness=2">
        <OurDivider thickness={2} />
      </Row>
      <Row label="thickness=4">
        <OurDivider thickness={4} />
      </Row>
      <Row label="lineStyle=dashed">
        <OurDivider lineStyle="dashed" thickness={2} />
      </Row>
      <Row label='color="var(--lifesg-bg-primary)"'>
        <OurDivider thickness={2} color="var(--lifesg-bg-primary)" />
      </Row>
      <Row label="in a CSS grid (col-span-2 of 4)">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2"><OurDivider thickness={2} /></div>
          <div className="col-span-2 text-xs text-muted-foreground">↑ spans 2 of 4 via wrapper</div>
        </div>
      </Row>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col">
      <Row label="default">
        <LifeSGDivider />
      </Row>
      <Row label="thickness={2}">
        <LifeSGDivider thickness={2} />
      </Row>
      <Row label="thickness={4}">
        <LifeSGDivider thickness={4} />
      </Row>
      <Row label='lineStyle="dashed"'>
        <LifeSGDivider lineStyle="dashed" thickness={2} />
      </Row>
      <Row label='color (theme fn)'>
        <LifeSGDivider thickness={2} color={(p: { theme?: unknown }) => {
          /* LifeSG accepts (props: ThemeStyleProps) => string. Tap the LifeSG primary. */
          void p;
          return "#1768BE";
        }} />
      </Row>
      <Row label="lgCols={6} of 12 (grid-aware)">
        <div className="w-full">
          <LifeSGDivider layoutType="grid" thickness={2} lgCols={6} />
          <div className="text-xs text-muted-foreground mt-1">↑ uses LifeSG&rsquo;s 12-col grid via lgCols</div>
        </div>
      </Row>
    </div>
  );
}
