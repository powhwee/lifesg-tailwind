"use client";

import type { ReactNode } from "react";
import { ErrorDisplay as OurErrorDisplay, type ErrorDisplayType } from "@/components/ui/error-display";
import { ErrorDisplay as LifeSGErrorDisplay } from "@lifesg/react-design-system/error-display";

/* Min-heights chosen as ≥ max(ours, lifesg) per row so both panes' rows
 * advance in lockstep — keeps the `type="..."` labels horizontally aligned
 * across the comparison. Update if a new row's natural height exceeds this. */
const ROW_FULL_MIN_H = "min-h-[560px]";
const ROW_IMAGE_ONLY_MIN_H = "min-h-[360px]";

function Row({ label, minH, children }: { label: string; minH?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 py-3 border-b border-border last:border-0 ${minH ?? ""}`}>
      <code className="text-xs text-muted-foreground" data-token={label}>{label}</code>
      <div className="w-full">{children}</div>
    </div>
  );
}

const TYPES_SHOWN: ErrorDisplayType[] = [
  "404",
  "500",
  "no-item-found",
  "maintenance",
  "logout",
];

export function OursPane() {
  return (
    <div className="flex flex-col">
      {TYPES_SHOWN.map((t) => (
        <Row key={t} label={`type="${t}"`} minH={ROW_FULL_MIN_H}>
          <OurErrorDisplay
            type={t}
            additionalProps={t === "maintenance" ? { dateString: "26 May 2026, 10:00 PM" } : undefined}
            actionButton={t === "404" || t === "500" ? { children: "Back to home" } : undefined}
          />
        </Row>
      ))}
      <Row label="imageOnly" minH={ROW_IMAGE_ONLY_MIN_H}>
        <OurErrorDisplay type="no-item-found" imageOnly />
      </Row>
      <Row label="title + description override" minH={ROW_FULL_MIN_H}>
        <OurErrorDisplay
          type="400"
          title="Booking unavailable"
          description="Slots for this clinic are full for today. Try a different date."
          actionButton={{ variant: "secondary", children: "Pick another date" }}
        />
      </Row>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col">
      {TYPES_SHOWN.map((t) => (
        <Row key={t} label={`type="${t}"`} minH={ROW_FULL_MIN_H}>
          <LifeSGErrorDisplay
            type={t}
            additionalProps={t === "maintenance" ? { dateString: "26 May 2026, 10:00 PM" } : undefined}
            actionButton={t === "404" || t === "500" ? { children: "Back to home" } : undefined}
          />
        </Row>
      ))}
      <Row label="imageOnly" minH={ROW_IMAGE_ONLY_MIN_H}>
        <LifeSGErrorDisplay type="no-item-found" imageOnly />
      </Row>
      <Row label="title + description override" minH={ROW_FULL_MIN_H}>
        <LifeSGErrorDisplay
          type="400"
          title="Booking unavailable"
          description="Slots for this clinic are full for today. Try a different date."
          actionButton={{ styleType: "secondary", children: "Pick another date" }}
        />
      </Row>
    </div>
  );
}
