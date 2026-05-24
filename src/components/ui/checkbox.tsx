"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Square, Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Checkbox chrome renders via Lucide `Square` (unchecked) plus a filled
 * background + Lucide `Check` / `Minus` (checked / indeterminate). Same
 * rationale as radio-button.tsx: Lucide is the project-wide icon vocabulary,
 * so we avoid the CSS-border vs SVG-stroke iteration loop that came from
 * trying to pixel-match LifeSG's branded SVG icons. The DESIGN-LANGUAGE
 * divergence is documented in docs/parity-principle.md. */

const checkboxVariants = cva(
  cn(
    "peer group relative inline-flex shrink-0 items-center justify-center rounded-sm outline-none transition-colors cursor-pointer",
    // Background: white default, filled when checked/indeterminate, muted when disabled.
    "bg-checkbox-bg hover:bg-checkbox-bg-hover",
    "data-[checked]:bg-checkbox-bg-checked",
    "data-[indeterminate]:bg-checkbox-bg-checked",
    "data-[disabled]:bg-checkbox-bg-disabled data-[disabled]:cursor-not-allowed",
    // Focus + error rings.
    "focus-visible:ring-3 focus-visible:ring-checkbox-ring-focus",
    "aria-invalid:ring-3 aria-invalid:ring-checkbox-ring-error"
  ),
  {
    variants: {
      displaySize: {
        // Sized to LifeSG's *visible* SVG content (~25.6 / ~19 px inside their
        // 32 / 24 containers). See radio-button.tsx for the rationale.
        default: "size-7",
        small: "size-5",
      },
    },
    defaultVariants: {
      displaySize: "default",
    },
  }
);

type CheckboxRootProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

export interface CheckboxProps
  extends Omit<CheckboxRootProps, "render">,
    VariantProps<typeof checkboxVariants> {}

function Checkbox({ className, displaySize, indeterminate, ...props }: CheckboxProps) {
  const iconSize = displaySize === "small" ? "size-4" : "size-5";
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(checkboxVariants({ displaySize, className }))}
      {...props}
    >
      {/* Outline square shown only when unchecked + not indeterminate. Stroke
       * colour drives off its own utility (independent of parent text). */}
      <Square
        aria-hidden
        className={cn(
          "size-full text-checkbox-border",
          "group-hover:text-checkbox-border-hover",
          "group-data-[disabled]:text-checkbox-border-disabled",
          "group-aria-invalid:text-checkbox-border-error",
          "group-data-[checked]:hidden group-data-[indeterminate]:hidden"
        )}
        strokeWidth={1.5}
      />
      {/* Check / Minus shown via BaseUI Indicator (auto-toggles on checked/indeterminate).
       * Colour: white on the filled blue bg, white on the disabled grey bg. */}
      <CheckboxPrimitive.Indicator className="absolute inset-0 inline-flex items-center justify-center text-checkbox-text-checked group-data-[disabled]:text-checkbox-text-disabled">
        {indeterminate ? (
          <Minus className={iconSize} strokeWidth={3} />
        ) : (
          <Check className={iconSize} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
