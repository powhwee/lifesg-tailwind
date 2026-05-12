"use client";

import { useState } from "react";
import { Textarea, FormTextarea } from "@/components/ui/textarea";
import { Form } from "@lifesg/react-design-system/form";
import { Textarea as LifeSGTextarea } from "@lifesg/react-design-system/input-textarea";

export function OursPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormTextarea (label + description)</code>
        <div className="mt-3">
          <FormTextarea
            label="Reason for application"
            description="Please describe in 1-2 sentences."
            placeholder="e.g. I am applying because..."
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={4}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with counter (maxLength=200)</code>
        <div className="mt-3">
          <Textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Type something..."
            maxLength={200}
            showCounter
            rows={3}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <Textarea disabled defaultValue="This field is locked." rows={3} />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.Textarea</code>
        <div className="mt-3">
          <Form.Textarea
            label={{ children: "Reason for application", subtitle: "Please describe in 1-2 sentences." }}
            placeholder="e.g. I am applying because..."
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={4}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with counter (maxLength=200)</code>
        <div className="mt-3">
          <LifeSGTextarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Type something..."
            maxLength={200}
            rows={3}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGTextarea disabled defaultValue="This field is locked." rows={3} />
        </div>
      </section>
    </div>
  );
}
