"use client";

import { useState } from "react";
import { RadioButton, RadioGroup } from "@/components/ui/radio-button";
import { RadioButton as LifeSGRadioButton } from "@lifesg/react-design-system/radio-button";

export function OursPane() {
  const [value, setValue] = useState<string>("apple");
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">grouped &mdash; default size</code>
        <RadioGroup value={value} onValueChange={(v) => setValue(String(v))} className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioButton value="apple" />
            <span className="text-sm">Apple</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioButton value="orange" />
            <span className="text-sm">Orange</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioButton value="pear" />
            <span className="text-sm">Pear</span>
          </label>
        </RadioGroup>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <RadioGroup defaultValue="b" className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioButton value="a" />
            <span className="text-sm">Unchecked</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <RadioButton value="b" />
            <span className="text-sm">Checked</span>
          </label>
          <label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <RadioButton value="c" disabled />
            <span className="text-sm">Disabled</span>
          </label>
          <label className="flex items-center gap-2">
            <RadioButton value="d" aria-invalid />
            <span className="text-sm">Error</span>
          </label>
        </RadioGroup>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">small size</code>
        <RadioGroup defaultValue="a" className="mt-3 flex items-center gap-6">
          <RadioButton value="a" displaySize="small" />
          <RadioButton value="b" displaySize="small" />
          <RadioButton value="c" displaySize="small" disabled />
        </RadioGroup>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [value, setValue] = useState<string>("apple");
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">grouped &mdash; default size</code>
        <div className="mt-3 flex items-center gap-6">
          {[
            { v: "apple", label: "Apple" },
            { v: "orange", label: "Orange" },
            { v: "pear", label: "Pear" },
          ].map(({ v, label }) => (
            <label key={v} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <LifeSGRadioButton checked={value === v} onChange={() => setValue(v)} />
              <span style={{ fontSize: 14 }}>{label}</span>
            </label>
          ))}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <div className="mt-3 flex items-center gap-6">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <LifeSGRadioButton />
            <span style={{ fontSize: 14 }}>Unchecked</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <LifeSGRadioButton checked />
            <span style={{ fontSize: 14 }}>Checked</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
            <LifeSGRadioButton disabled />
            <span style={{ fontSize: 14 }}>Disabled</span>
          </label>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">small size</code>
        <div className="mt-3 flex items-center gap-6">
          <LifeSGRadioButton displaySize="small" />
          <LifeSGRadioButton displaySize="small" checked />
          <LifeSGRadioButton displaySize="small" disabled />
        </div>
      </section>
    </div>
  );
}
