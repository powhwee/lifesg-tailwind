"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Toggle as LifeSGToggle } from "@lifesg/react-design-system/toggle";

export function OursPane() {
  const [checkbox, setCheckbox] = useState(true);
  const [radio, setRadio] = useState<string | null>("morning");
  const [yesno, setYesno] = useState<"yes" | "no" | null>(null);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;checkbox&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <Toggle
            type="checkbox"
            checked={checkbox}
            onCheckedChange={setCheckbox}
            subLabel="Allows deselection."
          >
            Subscribe to monthly digest
          </Toggle>
          <Toggle type="checkbox" subLabel="With composite content below." compositeSection={
            <div>Subsection visible when checked.</div>
          }>
            Add a delivery note
          </Toggle>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;radio&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          {(["morning", "afternoon"] as const).map((slot) => (
            <Toggle
              key={slot}
              type="radio"
              name="time-slot"
              value={slot}
              checked={radio === slot}
              onCheckedChange={(c) => c && setRadio(slot)}
              subLabel={slot === "morning" ? "9am - 12pm" : "1pm - 5pm"}
            >
              {slot === "morning" ? "Morning" : "Afternoon"}
            </Toggle>
          ))}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;yes&quot; / &quot;no&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <Toggle type="yes" checked={yesno === "yes"} onCheckedChange={() => setYesno("yes")}>
            Yes, contact me
          </Toggle>
          <Toggle type="no" checked={yesno === "no"} onCheckedChange={() => setYesno("no")}>
            No, do not contact me
          </Toggle>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <Toggle type="checkbox" disabled>Disabled</Toggle>
          <Toggle type="checkbox" disabled checked>Disabled checked</Toggle>
          <Toggle type="checkbox" error>Error state</Toggle>
          <Toggle type="checkbox" styleType="no-border">No border</Toggle>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [checkbox, setCheckbox] = useState(true);
  const [radio, setRadio] = useState<string | null>("morning");
  const [yesno, setYesno] = useState<"yes" | "no" | null>(null);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;checkbox&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <LifeSGToggle
            type="checkbox"
            checked={checkbox}
            onChange={(e) => setCheckbox(e.target.checked)}
            subLabel="Allows deselection."
          >
            Subscribe to monthly digest
          </LifeSGToggle>
          <LifeSGToggle
            type="checkbox"
            subLabel="With composite content below."
            compositeSection={{ children: <div>Subsection visible when checked.</div> }}
          >
            Add a delivery note
          </LifeSGToggle>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;radio&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          {(["morning", "afternoon"] as const).map((slot) => (
            <LifeSGToggle
              key={slot}
              type="radio"
              name="time-slot-lifesg"
              checked={radio === slot}
              onChange={() => setRadio(slot)}
              subLabel={slot === "morning" ? "9am - 12pm" : "1pm - 5pm"}
            >
              {slot === "morning" ? "Morning" : "Afternoon"}
            </LifeSGToggle>
          ))}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">type=&quot;yes&quot; / &quot;no&quot;</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <LifeSGToggle type="yes" checked={yesno === "yes"} onChange={() => setYesno("yes")}>
            Yes, contact me
          </LifeSGToggle>
          <LifeSGToggle type="no" checked={yesno === "no"} onChange={() => setYesno("no")}>
            No, do not contact me
          </LifeSGToggle>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <div className="mt-3 grid grid-cols-2 gap-3 max-w-2xl">
          <LifeSGToggle type="checkbox" disabled>Disabled</LifeSGToggle>
          <LifeSGToggle type="checkbox" disabled checked>Disabled checked</LifeSGToggle>
          <LifeSGToggle type="checkbox" error>Error state</LifeSGToggle>
          <LifeSGToggle type="checkbox" styleType="no-border">No border</LifeSGToggle>
        </div>
      </section>
    </div>
  );
}
