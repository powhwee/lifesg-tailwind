"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as LifeSGCalendar } from "@lifesg/react-design-system/calendar";

export function OursPane() {
  const [single, setSingle] = useState<string>("2026-05-12");
  const [multi, setMulti] = useState<string[]>(["2026-05-08", "2026-05-15"]);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">single, bordered</code>
        <div className="mt-3 inline-block">
          <Calendar variant="single" styleType="bordered" value={single} onChange={setSingle} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">selected: {single || "(none)"}</div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">multi, bordered, max 3</code>
        <div className="mt-3 inline-block">
          <Calendar variant="multi" styleType="bordered" values={multi} maxSelectable={3} onChange={setMulti} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">selected: {multi.join(", ") || "(none)"}</div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [single, setSingle] = useState<string>("2026-05-12");
  const [multi, setMulti] = useState<string[]>(["2026-05-08", "2026-05-15"]);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">single, bordered</code>
        <div className="mt-3 inline-block">
          <LifeSGCalendar variant="single" styleType="bordered" value={single} onChange={setSingle} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">selected: {single || "(none)"}</div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">multi, bordered, max 3</code>
        <div className="mt-3 inline-block">
          <LifeSGCalendar variant="multi" styleType="bordered" values={multi} maxSelectable={3} onChange={setMulti} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">selected: {multi.join(", ") || "(none)"}</div>
      </section>
    </div>
  );
}
