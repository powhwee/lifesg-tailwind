"use client";

import { HelpCircle } from "lucide-react";
import { PopoverV2 } from "@/components/ui/popover-v2";
import { PopoverInline as LifeSGPopoverInline } from "@lifesg/react-design-system/popover-v2";

export function OursPane() {
  return (
    <div className="flex flex-col gap-12 p-8" data-testid="overlays-popover-inline-ours">
      <section>
        <code className="text-xs text-muted-foreground">default</code>
        <p className="mt-4 text-base">
          Your eligibility depends on your{" "}
          <PopoverV2.Inline
            content="household income"
            popoverContent="Household income includes wages, dividends, and rental income."
          />
          {" "}for the past 12 months.
        </p>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">dashed underline</code>
        <p className="mt-4 text-base">
          The application closes on{" "}
          <PopoverV2.Inline
            content="31 December"
            underlineStyle="underline-dashed"
            underlineHoverStyle="underline"
            popoverContent="Singapore Standard Time (UTC+8) end of day."
          />
          .
        </p>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">custom icon</code>
        <p className="mt-4 text-base">
          Tell us about your{" "}
          <PopoverV2.Inline
            content="dependents"
            icon={<HelpCircle className="size-4" aria-hidden="true" />}
            popoverContent="Dependents are children under 16 or family members you support."
          />
          .
        </p>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-12 p-8" data-testid="overlays-popover-inline-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">default</code>
        <p style={{ marginTop: 16 }}>
          Your eligibility depends on your{" "}
          <LifeSGPopoverInline
            content="household income"
            popoverContent="Household income includes wages, dividends, and rental income."
          />
          {" "}for the past 12 months.
        </p>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">dashed underline</code>
        <p style={{ marginTop: 16 }}>
          The application closes on{" "}
          <LifeSGPopoverInline
            content="31 December"
            underlineStyle="underline-dashed"
            underlineHoverStyle="underline"
            popoverContent="Singapore Standard Time (UTC+8) end of day."
          />
          .
        </p>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">custom icon</code>
        <p style={{ marginTop: 16 }}>
          Tell us about your{" "}
          <LifeSGPopoverInline
            content="dependents"
            popoverContent="Dependents are children under 16 or family members you support."
          />
          .
        </p>
      </section>
    </div>
  );
}
