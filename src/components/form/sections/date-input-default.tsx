"use client";

import { useState } from "react";
import { DateInput, FormDateInput } from "@/components/ui/date-input";
import { Form } from "@lifesg/react-design-system/form";
import { DateInput as LifeSGDateInput } from "@lifesg/react-design-system/date-input";

export function OursPane() {
  const [a, setA] = useState("2026-05-12");
  const [b, setB] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md">
      <section>
        <code className="text-xs text-muted-foreground">FormDateInput (label + description)</code>
        <div className="mt-3" data-token="form-date">
          <FormDateInput
            label="Application date"
            description="The date you'd like the application to be processed."
            value={a}
            onChange={setA}
          />
          <p className="mt-2 text-xs text-muted-foreground">value: <code>{a || "(empty)"}</code></p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">withButton — calendar shows Cancel/Done</code>
        <div className="mt-3" data-token="with-button">
          <DateInput value={b} onChange={setB} withButton />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3" data-token="disabled">
          <DateInput value="2026-05-12" disabled />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">min/max — only May 2026 selectable</code>
        <div className="mt-3" data-token="min-max">
          <DateInput
            value=""
            onChange={() => {}}
            minDate="2026-05-01"
            maxDate="2026-05-31"
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState("2026-05-12");
  const [b, setB] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md">
      <section>
        <code className="text-xs text-muted-foreground">Form.DateInput</code>
        <div className="mt-3" data-token="form-date">
          <Form.DateInput
            label={{ children: "Application date", subtitle: "The date you'd like the application to be processed." }}
            value={a}
            onChange={setA}
          />
          <p className="mt-2 text-xs text-muted-foreground">value: <code>{a || "(empty)"}</code></p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">withButton</code>
        <div className="mt-3" data-token="with-button">
          <LifeSGDateInput value={b} onChange={setB} withButton />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3" data-token="disabled">
          <LifeSGDateInput value="2026-05-12" disabled />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">min/max — only May 2026</code>
        <div className="mt-3" data-token="min-max">
          <LifeSGDateInput value="" onChange={() => {}} minDate="2026-05-01" maxDate="2026-05-31" />
        </div>
      </section>
    </div>
  );
}
