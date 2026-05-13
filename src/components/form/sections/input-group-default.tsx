"use client";

import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  FormInputGroup,
} from "@/components/ui/input-group";
import { Form } from "@lifesg/react-design-system/form";
import { InputGroup as LifeSGInputGroup } from "@lifesg/react-design-system/input-group";

export function OursPane() {
  const [amount, setAmount] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormInputGroup — currency</code>
        <div className="mt-3">
          <FormInputGroup label="Amount" description="In Singapore dollars">
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormInputGroup>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">label addon (left)</code>
        <div className="mt-3">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">label addon (right)</code>
        <div className="mt-3">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>Go</InputGroupAddon>
          </InputGroup>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [amount, setAmount] = useState("");
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.InputGroup — currency</code>
        <div className="mt-3">
          <Form.InputGroup
            label={{ children: "Amount", subtitle: "In Singapore dollars" }}
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            addon={{ type: "label", attributes: { value: "$" } }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">label addon (left)</code>
        <div className="mt-3">
          <LifeSGInputGroup
            placeholder="example.com"
            addon={{ type: "label", attributes: { value: "https://" } }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">label addon (right)</code>
        <div className="mt-3">
          <LifeSGInputGroup
            placeholder="Search..."
            addon={{ type: "label", attributes: { value: "Go" }, position: "right" }}
          />
        </div>
      </section>
    </div>
  );
}
