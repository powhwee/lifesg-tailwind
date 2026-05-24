"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  cn(
    "peer inline-flex shrink-0 items-center justify-center rounded-sm border-2 bg-clip-padding outline-none transition-colors cursor-pointer",
    "border-checkbox-border bg-checkbox-bg text-checkbox-text",
    "hover:border-checkbox-border-hover hover:bg-checkbox-bg-hover",
    "focus-visible:ring-3 focus-visible:ring-checkbox-ring-focus",
    "data-[checked]:bg-checkbox-bg-checked data-[checked]:border-checkbox-border-checked data-[checked]:text-checkbox-text-checked",
    "data-[indeterminate]:bg-checkbox-bg-checked data-[indeterminate]:border-checkbox-border-checked data-[indeterminate]:text-checkbox-text-checked",
    "data-[disabled]:bg-checkbox-bg-disabled data-[disabled]:border-checkbox-border-disabled data-[disabled]:text-checkbox-text-disabled data-[disabled]:cursor-not-allowed",
    "aria-invalid:border-checkbox-border-error aria-invalid:ring-3 aria-invalid:ring-checkbox-ring-error"
  ),
  {
    variants: {
      displaySize: {
        // Sized to match LifeSG's *visible* checkbox area. LifeSG renders an
        // SVG whose path uses ~14 of the 20-unit viewBox (the remainder is
        // transparent padding inside their 32px container), so their checkbox
        // reads as ~22.4 / ~16.8 px even though the box-model is 32 / 24. We
        // pin our outer box to that visible size for parity. Touch hit-area
        // extends via the surrounding <label> in every S&I demo.
        default: "size-6",
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
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(checkboxVariants({ displaySize, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="inline-flex items-center justify-center">
        {indeterminate ? (
          <Minus className={displaySize === "small" ? "size-3" : "size-4"} strokeWidth={3} />
        ) : (
          <Check className={displaySize === "small" ? "size-3" : "size-4"} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
