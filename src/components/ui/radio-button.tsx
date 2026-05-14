"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioVariants = cva(
  cn(
    "peer inline-flex shrink-0 items-center justify-center rounded-full border bg-clip-padding outline-none transition-colors cursor-pointer",
    "border-radio-border bg-radio-bg text-radio-dot",
    "hover:border-radio-border-hover hover:bg-radio-bg-hover",
    "focus-visible:ring-3 focus-visible:ring-radio-ring-focus",
    "data-[checked]:border-radio-border-checked",
    "data-[disabled]:bg-radio-bg-disabled data-[disabled]:border-radio-border-disabled data-[disabled]:text-radio-dot-disabled data-[disabled]:cursor-not-allowed",
    "aria-invalid:border-radio-border-error aria-invalid:ring-3 aria-invalid:ring-radio-ring-error"
  ),
  {
    variants: {
      displaySize: {
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
      <RadioPrimitive.Indicator
        className={cn(
          "rounded-full bg-current",
          displaySize === "small" ? "size-2.5" : "size-3.5"
        )}
      />
    </RadioPrimitive.Root>
  );
}

const RadioGroup = RadioGroupPrimitive;

export { RadioButton, RadioGroup };
