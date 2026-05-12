"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Checkbox as LifeSGCheckbox } from "@lifesg/react-design-system/checkbox";

export function OursPane() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">states &mdash; default size</code>
        <div className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={a} onCheckedChange={(v) => setA(Boolean(v))} />
            <span className="text-sm">Unchecked</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={b} onCheckedChange={(v) => setB(Boolean(v))} />
            <span className="text-sm">Checked</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox indeterminate />
            <span className="text-sm">Indeterminate</span>
          </label>
          <label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <Checkbox disabled />
            <span className="text-sm">Disabled</span>
          </label>
          <label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <Checkbox disabled checked />
            <span className="text-sm">Disabled checked</span>
          </label>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states &mdash; small</code>
        <div className="mt-3 flex items-center gap-6">
          <Checkbox displaySize="small" />
          <Checkbox displaySize="small" checked />
          <Checkbox displaySize="small" indeterminate />
          <Checkbox displaySize="small" disabled />
          <Checkbox displaySize="small" disabled checked />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">states &mdash; default size</code>
        <div className="mt-3 flex items-center gap-6">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <LifeSGCheckbox checked={a} onChange={() => setA(!a)} />
            <span style={{ fontSize: 14 }}>Unchecked</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <LifeSGCheckbox checked={b} onChange={() => setB(!b)} />
            <span style={{ fontSize: 14 }}>Checked</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <LifeSGCheckbox indeterminate checked />
            <span style={{ fontSize: 14 }}>Indeterminate</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
            <LifeSGCheckbox disabled />
            <span style={{ fontSize: 14 }}>Disabled</span>
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
            <LifeSGCheckbox disabled checked />
            <span style={{ fontSize: 14 }}>Disabled checked</span>
          </label>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states &mdash; small</code>
        <div className="mt-3 flex items-center gap-6">
          <LifeSGCheckbox displaySize="small" />
          <LifeSGCheckbox displaySize="small" checked />
          <LifeSGCheckbox displaySize="small" indeterminate checked />
          <LifeSGCheckbox displaySize="small" disabled />
          <LifeSGCheckbox displaySize="small" disabled checked />
        </div>
      </section>
    </div>
  );
}
