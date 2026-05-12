"use client";

import { Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PopoverTrigger as LifeSGPopoverTrigger } from "@lifesg/react-design-system/popover-v2";

export function OursPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic — click to open</code>
        <div className="mt-3">
          <Popover>
            <PopoverTrigger
              render={(triggerProps) => (
                <Button {...triggerProps} variant="outline" size="sm">
                  Open popover
                </Button>
              )}
            />
            <PopoverContent className="p-3 w-64">
              <p className="text-sm">
                Popover content here. Press <kbd className="text-xs">Esc</kbd> or click outside to dismiss.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">with icon trigger + custom side offset</code>
        <div className="mt-3">
          <Popover>
            <PopoverTrigger
              render={(triggerProps) => (
                <button
                  {...triggerProps}
                  type="button"
                  aria-label="More info"
                  className="grid place-items-center size-8 rounded-md hover:bg-[var(--lifesg-bg-hover)]"
                >
                  <Info className="size-5 text-[var(--lifesg-icon-primary)]" />
                </button>
              )}
            />
            <PopoverContent sideOffset={8} className="p-3 w-72">
              <p className="text-sm">
                <strong className="font-semibold">Tip:</strong> popovers are anchored to their
                trigger and reposition when scrolled.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">side / align — open above, end-aligned</code>
        <div className="mt-3">
          <Popover>
            <PopoverTrigger
              render={(triggerProps) => (
                <Button {...triggerProps} variant="outline" size="sm">
                  Above + end
                </Button>
              )}
            />
            <PopoverContent side="top" align="end" className="p-3 w-64">
              <p className="text-sm">
                Anchored to the top, aligned to the end of the trigger.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">PopoverV2.PopoverTrigger — click</code>
        <div className="mt-3">
          <LifeSGPopoverTrigger
            trigger="click"
            popoverContent={
              <p style={{ fontSize: 14, margin: 0 }}>
                Popover content here. Click outside to dismiss.
              </p>
            }
          >
            <button
              type="button"
              style={{
                height: 40,
                padding: "0 12px",
                background: "transparent",
                border: "1px solid #C7CACA",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Open popover
            </button>
          </LifeSGPopoverTrigger>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">icon trigger</code>
        <div className="mt-3">
          <LifeSGPopoverTrigger
            trigger="click"
            popoverContent={
              <p style={{ fontSize: 14, margin: 0 }}>
                <strong>Tip:</strong> popovers are anchored to their trigger.
              </p>
            }
          >
            <button
              type="button"
              aria-label="More info"
              style={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <Info className="size-5" />
            </button>
          </LifeSGPopoverTrigger>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">hover variant</code>
        <div className="mt-3">
          <LifeSGPopoverTrigger
            trigger="hover"
            popoverContent={<p style={{ fontSize: 14, margin: 0 }}>Hover-triggered popover.</p>}
          >
            <button
              type="button"
              style={{
                height: 40,
                padding: "0 12px",
                background: "transparent",
                border: "1px solid #C7CACA",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Hover me
            </button>
          </LifeSGPopoverTrigger>
        </div>
      </section>
    </div>
  );
}
