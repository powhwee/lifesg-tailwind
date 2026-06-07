"use client";

import { PopoverV2 } from "@/components/ui/popover-v2";
import { Button } from "@/components/ui/button";
import { PopoverV2 as LifeSGPopoverV2, PopoverTrigger as LifeSGPopoverV2Trigger } from "@lifesg/react-design-system/popover-v2";

export function OursPane() {
  return (
    <div className="flex flex-col gap-12 p-8" data-testid="overlays-popover-v2-ours">
      <section>
        <code className="text-xs text-muted-foreground">click trigger</code>
        <div className="mt-4">
          <PopoverV2.Trigger
            trigger="click"
            popoverContent="Click the trigger to open this panel. Click outside to dismiss."
          >
            <Button variant="outline">Click me</Button>
          </PopoverV2.Trigger>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">hover trigger</code>
        <div className="mt-4">
          <PopoverV2.Trigger
            trigger="hover"
            delay={{ open: 100, close: 250 }}
            popoverContent="Hover the trigger to peek at this panel."
          >
            <Button variant="outline">Hover me</Button>
          </PopoverV2.Trigger>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">rich content</code>
        <div className="mt-4">
          <PopoverV2.Trigger
            popoverContent={
              <PopoverV2 ariaLabel="Eligibility">
                <h3 className="font-semibold mb-2">Eligibility</h3>
                <p className="text-sm">
                  You must be a Singapore citizen aged 21 or above.
                </p>
              </PopoverV2>
            }
          >
            <Button variant="outline">Show eligibility</Button>
          </PopoverV2.Trigger>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-12 p-8" data-testid="overlays-popover-v2-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">click trigger</code>
        <div className="mt-4">
          <LifeSGPopoverV2Trigger
            trigger="click"
            popoverContent="Click the trigger to open this panel. Click outside to dismiss."
          >
            <button>Click me</button>
          </LifeSGPopoverV2Trigger>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">hover trigger</code>
        <div className="mt-4">
          <LifeSGPopoverV2Trigger
            trigger="hover"
            delay={{ open: 100, close: 250 }}
            popoverContent="Hover the trigger to peek at this panel."
          >
            <button>Hover me</button>
          </LifeSGPopoverV2Trigger>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">rich content</code>
        <div className="mt-4">
          <LifeSGPopoverV2Trigger
            popoverContent={
              <LifeSGPopoverV2 ariaLabel="Eligibility">
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Eligibility</h3>
                <p>You must be a Singapore citizen aged 21 or above.</p>
              </LifeSGPopoverV2>
            }
          >
            <button>Show eligibility</button>
          </LifeSGPopoverV2Trigger>
        </div>
      </section>
    </div>
  );
}
