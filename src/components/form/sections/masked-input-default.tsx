"use client";

import { MaskedInput, FormMaskedInput } from "@/components/ui/masked-input";
import { Form } from "@lifesg/react-design-system/form";
import { MaskedInput as LifeSGMaskedInput } from "@lifesg/react-design-system/masked-input";

export function OursPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">FormMaskedInput — full mask (default)</code>
        <div className="mt-3">
          <FormMaskedInput
            label="Password"
            description="At least 12 characters"
            value="hunter12345"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">NRIC mask — chars 1-5 hidden, others visible</code>
        <div className="mt-3">
          <MaskedInput value="S1234567A" maskRange={[1, 6]} maskChar="*" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">unmaskRange — only last 4 visible</code>
        <div className="mt-3">
          <MaskedInput value="4111222233334444" unmaskRange={[12, 16]} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">starts unmasked</code>
        <div className="mt-3">
          <MaskedInput value="open-by-default" disableMask />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">Form.MaskedInput — full mask</code>
        <div className="mt-3">
          <Form.MaskedInput
            label={{ children: "Password", subtitle: "At least 12 characters" }}
            value="hunter12345"
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">NRIC mask — chars 1-5 hidden</code>
        <div className="mt-3">
          <LifeSGMaskedInput value="S1234567A" maskRange={[1, 6]} maskChar="*" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">unmaskRange — only last 4 visible</code>
        <div className="mt-3">
          <LifeSGMaskedInput value="4111222233334444" unmaskRange={[12, 16]} />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">starts unmasked</code>
        <div className="mt-3">
          <LifeSGMaskedInput value="open-by-default" disableMask />
        </div>
      </section>
    </div>
  );
}
