"use client";

import { useState } from "react";
import {
  PhoneNumberInput,
  FormPhoneNumberInput,
  type PhoneNumberInputValue,
} from "@/components/ui/phone-number-input";
import { Form } from "@lifesg/react-design-system/form";
import { PhoneNumberInput as LifeSGPhoneNumberInput } from "@lifesg/react-design-system/phone-number-input";

export function OursPane() {
  const [a, setA] = useState<PhoneNumberInputValue>({ countryCode: "+65" });
  const [b, setB] = useState<PhoneNumberInputValue>({ countryCode: "+65", number: "12345678" });
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormPhoneNumberInput (label + description)</code>
        <div className="mt-3">
          <FormPhoneNumberInput
            label="Mobile number"
            description="We'll send a one-time verification code"
            value={a}
            onChange={setA}
            placeholder="91234567"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled value</code>
        <div className="mt-3">
          <PhoneNumberInput value={b} onChange={setB} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">fixedCountry — country dropdown locked</code>
        <div className="mt-3">
          <PhoneNumberInput
            value={{ countryCode: "+65", number: "" }}
            fixedCountry
            placeholder="91234567"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <PhoneNumberInput value={{ countryCode: "+65", number: "91234567" }} disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [a, setA] = useState<PhoneNumberInputValue>({ countryCode: "+65" });
  const [b, setB] = useState<PhoneNumberInputValue>({ countryCode: "+65", number: "12345678" });
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.PhoneNumberInput</code>
        <div className="mt-3">
          <Form.PhoneNumberInput
            label={{ children: "Mobile number", subtitle: "We'll send a one-time verification code" }}
            value={a}
            onChange={(v) => setA(v ?? {})}
            placeholder="91234567"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">prefilled value</code>
        <div className="mt-3">
          <LifeSGPhoneNumberInput value={b} onChange={(v) => setB(v ?? {})} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">fixedCountry — country dropdown locked</code>
        <div className="mt-3">
          <LifeSGPhoneNumberInput
            value={{ countryCode: "+65" }}
            fixedCountry
            placeholder="91234567"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3">
          <LifeSGPhoneNumberInput
            value={{ countryCode: "+65", number: "91234567" }}
            disabled
          />
        </div>
      </section>
    </div>
  );
}
