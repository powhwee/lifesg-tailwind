"use client";

import { useState } from "react";
import { Input, FormInput } from "@/components/ui/input";
import { Form } from "@lifesg/react-design-system/form";
import { Input as LifeSGInput } from "@lifesg/react-design-system/input";

export function OursPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("user@example.com");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormInput (label + description + error)</code>
        <div className="mt-3">
          <FormInput
            label="Email address"
            description="We'll only use this to contact you about your application."
            type="email"
            placeholder="name@example.com"
            value={a}
            onChange={(e) => setA(e.target.value)}
            errorMessage={a.length > 0 && !a.includes("@") ? "Please include an @" : undefined}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">Input + allowClear</code>
        <div className="mt-3">
          <Input
            type="text"
            value={b}
            allowClear
            onClear={() => setB("")}
            onChange={(e) => setB(e.target.value)}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">readOnly</code>
        <div className="mt-3">
          <Input type="text" readOnly defaultValue="locked@example.com" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <Input type="text" disabled defaultValue="user@example.com" />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState("");
  const [b, setB] = useState("user@example.com");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.Input (label + error)</code>
        <div className="mt-3">
          <Form.Input
            label={{ children: "Email address", subtitle: "We'll only use this to contact you about your application." }}
            type="email"
            placeholder="name@example.com"
            value={a}
            onChange={(e) => setA(e.target.value)}
            errorMessage={a.length > 0 && !a.includes("@") ? "Please include an @" : undefined}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">Input + allowClear</code>
        <div className="mt-3">
          <LifeSGInput
            type="text"
            value={b}
            allowClear
            onClear={() => setB("")}
            onChange={(e) => setB(e.target.value)}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">readOnly</code>
        <div className="mt-3">
          <LifeSGInput type="text" readOnly defaultValue="locked@example.com" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGInput type="text" disabled defaultValue="user@example.com" />
        </div>
      </section>
    </div>
  );
}
