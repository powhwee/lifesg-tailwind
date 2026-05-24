"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Radio chrome: outer ring is Lucide `Circle` (SVG, replaces CSS border so
 * the rendering primitive matches LifeSG's SVG icons). Inner filled dot is
 * a CSS `rounded-full bg-current` span — Lucide's `CircleDot` has its dot
 * proportionally too small for a radio (looks like a tiny dot inside a big
 * ring), so we render the dot ourselves and pick a size that reads right.
 * See docs/parity-principle.md "When to deliberately diverge" — the chrome
 * is DESIGN-LANGUAGE-divergent from LifeSG's branded SVG icons by design. */

const radioVariants = cva(
  cn(
    "peer group relative inline-flex shrink-0 items-center justify-center rounded-full outline-none transition-colors cursor-pointer",
    // Background drives off its own variants; icon colors are set on each
    // child below so disabled-checked vs disabled-unchecked can diverge.
    "bg-radio-bg hover:bg-radio-bg-hover",
    "data-[disabled]:bg-radio-bg-disabled data-[disabled]:cursor-not-allowed",
    "focus-visible:ring-3 focus-visible:ring-radio-ring-focus",
    "aria-invalid:ring-3 aria-invalid:ring-radio-ring-error"
  ),
  {
    variants: {
      displaySize: {
        // Sized to LifeSG's *visible* SVG outer ring (~25.6px = ~16/20 viewBox
        // units inside their 32px container). Tailwind size-7 (28px) is the
        // closest standard step; size-5 (20px) for small (LifeSG visible small
        // ~19px). Trade-off: box-model gap of 4px vs LifeSG's 32/24 containers,
        // allowlisted as VISUAL-PARITY in measure-selection-and-input.mjs.
        default: "size-7",
        small: "size-5",
      },
    },
    defaultVariants: {
      displaySize: "default",
    },
  }
);

type RadioRootProps<V> = React.ComponentProps<typeof RadioPrimitive.Root<V>>;

export interface RadioButtonProps<V = string>
  extends Omit<RadioRootProps<V>, "render">,
    VariantProps<typeof radioVariants> {}

function RadioButton<V = string>({
  className,
  displaySize,
  ...props
}: RadioButtonProps<V>) {
  // Inner dot scaled to ~⅓ of outer ring — visually balanced for both sizes.
  const dotSize = displaySize === "small" ? "size-2.5" : "size-3";
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(radioVariants({ displaySize, className }))}
      {...props}
    >
      {/* Outer ring — Lucide Circle. Stroke color flips between unchecked and
       * checked tokens via the parent's data-checked attribute. */}
      <Circle
        aria-hidden
        className={cn(
          "size-full text-radio-border",
          "group-hover:text-radio-border-hover",
          "group-data-[checked]:text-radio-border-checked",
          "group-data-[disabled]:text-radio-border-disabled",
          "group-aria-invalid:text-radio-border-error"
        )}
        strokeWidth={2}
      />
      {/* Inner filled dot — BaseUI Indicator only renders when checked */}
      <RadioPrimitive.Indicator className="absolute inset-0 inline-flex items-center justify-center text-radio-border-checked group-data-[disabled]:text-radio-dot-disabled">
        <span aria-hidden className={cn("rounded-full bg-current", dotSize)} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

const RadioGroup = RadioGroupPrimitive;

export { RadioButton, RadioGroup };
