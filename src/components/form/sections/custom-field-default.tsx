"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Form } from "@lifesg/react-design-system/form";

export function OursPane() {
  const [v, setV] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormField (convenience wrapper)</code>
        <div className="mt-3">
          <FormField
            label="Address line 1"
            description="Block, street name, building"
            errorMessage={v.length > 0 && v.length < 5 ? "Too short — at least 5 characters" : undefined}
          >
            <input
              type="text"
              value={v}
              onChange={(e) => setV(e.target.value)}
              className="h-12 w-full rounded-md border border-lifesg-border px-3 text-base outline-none focus:border-lifesg-border-focus"
              placeholder="e.g. 123 Sample Street #01-23"
            />
          </FormField>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">Field (headless composition)</code>
        <div className="mt-3">
          <Field>
            <FieldLabel>Address line 2</FieldLabel>
            <FieldDescription>Unit number or building name</FieldDescription>
            <input
              type="text"
              className="h-12 w-full rounded-md border border-lifesg-border px-3 text-base outline-none focus:border-lifesg-border-focus"
              placeholder="Optional"
            />
          </Field>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <FormField label="Email" description="Currently locked" disabled>
            <input
              type="email"
              disabled
              defaultValue="user@example.com"
              className="h-12 w-full rounded-md border border-lifesg-border-disabled bg-lifesg-bg-disabled px-3 text-base text-lifesg-text-disabled"
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [v, setV] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.CustomField</code>
        <div className="mt-3">
          <Form.CustomField
            label={{ children: "Address line 1", subtitle: "Block, street name, building" }}
            errorMessage={v.length > 0 && v.length < 5 ? "Too short — at least 5 characters" : undefined}
          >
            <input
              type="text"
              value={v}
              onChange={(e) => setV(e.target.value)}
              style={{
                height: 48,
                width: "100%",
                borderRadius: 4,
                border: "1px solid #C7CACA",
                padding: "0 12px",
                fontSize: 16,
                outline: "none",
              }}
              placeholder="e.g. 123 Sample Street #01-23"
            />
          </Form.CustomField>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">Form.CustomField (no error)</code>
        <div className="mt-3">
          <Form.CustomField label={{ children: "Address line 2", subtitle: "Unit number or building name" }}>
            <input
              type="text"
              style={{
                height: 48,
                width: "100%",
                borderRadius: 4,
                border: "1px solid #C7CACA",
                padding: "0 12px",
                fontSize: 16,
                outline: "none",
              }}
              placeholder="Optional"
            />
          </Form.CustomField>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <Form.CustomField label="Email" disabled>
            <input
              type="email"
              disabled
              defaultValue="user@example.com"
              style={{
                height: 48,
                width: "100%",
                borderRadius: 4,
                border: "1px solid #E8E8E8",
                background: "#F4F4F4",
                color: "#686868",
                padding: "0 12px",
                fontSize: 16,
              }}
            />
          </Form.CustomField>
        </div>
      </section>
    </div>
  );
}
