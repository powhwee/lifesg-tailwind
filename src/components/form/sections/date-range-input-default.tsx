"use client";

import { useState } from "react";
import { DateRangeInput, FormDateRangeInput } from "@/components/ui/date-range-input";
import { Form } from "@lifesg/react-design-system/form";
import { DateRangeInput as LifeSGDateRangeInput } from "@lifesg/react-design-system/date-range-input";

export function OursPane() {
  const [start, setStart] = useState("2026-05-12");
  const [end, setEnd] = useState("2026-05-19");
  const [empty, setEmpty] = useState({ start: "", end: "" });
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormDateRangeInput (label)</code>
        <div className="mt-3">
          <FormDateRangeInput
            label="Booking dates"
            description="From check-in to check-out."
            value={start}
            valueEnd={end}
            onChange={(s, e) => {
              setStart(s);
              setEnd(e);
            }}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            range: <code>{start || "(empty)"}</code> → <code>{end || "(empty)"}</code>
          </p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">empty</code>
        <div className="mt-3">
          <DateRangeInput
            value={empty.start}
            valueEnd={empty.end}
            onChange={(s, e) => setEmpty({ start: s, end: e })}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <DateRangeInput value="2026-05-12" valueEnd="2026-05-19" disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [start, setStart] = useState("2026-05-12");
  const [end, setEnd] = useState("2026-05-19");
  const [empty, setEmpty] = useState({ start: "", end: "" });
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.DateRangeInput</code>
        <div className="mt-3">
          <Form.DateRangeInput
            label={{ children: "Booking dates", subtitle: "From check-in to check-out." }}
            value={start}
            valueEnd={end}
            onChange={(s, e) => {
              setStart(s);
              setEnd(e);
            }}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            range: <code>{start || "(empty)"}</code> → <code>{end || "(empty)"}</code>
          </p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">empty</code>
        <div className="mt-3">
          <LifeSGDateRangeInput
            value={empty.start}
            valueEnd={empty.end}
            onChange={(s, e) => setEmpty({ start: s, end: e })}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGDateRangeInput value="2026-05-12" valueEnd="2026-05-19" disabled />
        </div>
      </section>
    </div>
  );
}
