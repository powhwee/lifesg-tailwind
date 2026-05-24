"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Circle, CircleDot } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Radio chrome renders via Lucide `Circle` (unchecked) and `CircleDot` (checked).
 * Rationale: Lucide is the project-wide icon vocabulary (~30 icons across the
 * codebase). LifeSG renders its radio via branded SVG icons from
 * `@lifesg/react-icons`, which is the outlier within OUR design language.
 * Visual chrome divergence from LifeSG is classified as DESIGN-LANGUAGE in
 * docs/parity-principle.md, not a defect to chase. */

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
        // Matches LifeSG's box-model (32px / 24px). Visual chrome divergence
        // from LifeSG is classified as DESIGN-LANGUAGE — see docs/parity-principle.md.
        default: "size-8",
        small: "size-6",
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
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(radioVariants({ displaySize, className }))}
      {...props}
    >
      {/* Outline ring shown when unchecked */}
      <Circle
        aria-hidden
        className={cn(
          "size-full text-radio-border",
          "group-hover:text-radio-border-hover",
          "group-data-[disabled]:text-radio-border-disabled",
          "group-aria-invalid:text-radio-border-error",
          "group-data-[checked]:hidden"
        )}
        strokeWidth={1.5}
      />
      {/* Checked-state ring + filled dot (BaseUI Indicator only renders when checked) */}
      <RadioPrimitive.Indicator className="absolute inset-0 inline-flex items-center justify-center text-radio-border-checked group-data-[disabled]:text-radio-dot-disabled">
        <CircleDot aria-hidden className="size-full" strokeWidth={1.5} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

const RadioGroup = RadioGroupPrimitive;

export { RadioButton, RadioGroup };
