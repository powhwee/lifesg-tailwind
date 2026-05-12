"use client";

import { useState } from "react";
import { UnitNumberInput, FormUnitNumberInput } from "@/components/ui/unit-number-input";
import { Form } from "@lifesg/react-design-system/form";
import { UnitNumberInput as LifeSGUnitNumberInput } from "@lifesg/react-design-system/unit-number";

export function OursPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("12-345");
  const [raw, setRaw] = useState<[string, string]>(["", ""]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormUnitNumberInput</code>
        <div className="mt-3">
          <FormUnitNumberInput
            label="Unit number"
            description="Floor and unit (e.g. 12-345)"
            value={a}
            onChange={setA}
            onChangeRaw={setRaw}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            value: <code>{a || "(empty)"}</code> · raw: <code>[{raw[0]}, {raw[1]}]</code>
          </p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled</code>
        <div className="mt-3">
          <UnitNumberInput value={b} onChange={setB} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <UnitNumberInput value="03-021" disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("12-345");
  const [raw, setRaw] = useState<string[]>(["", ""]);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.UnitNumberInput</code>
        <div className="mt-3">
          <Form.UnitNumberInput
            label={{ children: "Unit number", subtitle: "Floor and unit (e.g. 12-345)" }}
            value={a}
            onChange={setA}
            onChangeRaw={setRaw}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            value: <code>{a || "(empty)"}</code> · raw: <code>[{raw[0]}, {raw[1]}]</code>
          </p>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled</code>
        <div className="mt-3">
          <LifeSGUnitNumberInput value={b} onChange={setB} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGUnitNumberInput value="03-021" disabled />
        </div>
      </section>
    </div>
  );
}
