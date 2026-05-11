"use client";

import { useState } from "react";
import { OtpInput } from "@/components/ui/otp-input";
import { OtpInput as LifeSGOtpInput } from "@lifesg/react-design-system/otp-input";

export function OursPane() {
  const [v, setV] = useState<string[]>(["", "", "", "", "", ""]);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic, 6 digits, 30s cooldown</code>
        <div className="mt-3">
          <OtpInput
            numOfInput={6}
            value={v}
            onChange={setV}
            cooldownDuration={30}
            actionButtonProps={{ children: "Verify" }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with prefix &amp; error</code>
        <div className="mt-3">
          <OtpInput
            numOfInput={4}
            prefix={{ value: "ABC", separator: "-" }}
            errorMessage="Invalid code. Please try again."
            cooldownDuration={15}
            actionButtonProps={{ children: "Resend" }}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [v, setV] = useState<string[]>(["", "", "", "", "", ""]);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic, 6 digits, 30s cooldown</code>
        <div className="mt-3">
          <LifeSGOtpInput
            numOfInput={6}
            value={v}
            onChange={setV}
            cooldownDuration={30}
            actionButtonProps={{ children: "Verify" }}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with prefix &amp; error</code>
        <div className="mt-3">
          <LifeSGOtpInput
            numOfInput={4}
            prefix={{ value: "ABC", separator: "-" }}
            errorMessage="Invalid code. Please try again."
            cooldownDuration={15}
            actionButtonProps={{ children: "Resend" }}
          />
        </div>
      </section>
    </div>
  );
}
