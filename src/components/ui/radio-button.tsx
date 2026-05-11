"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioVariants = cva(
  cn(
    "peer inline-flex shrink-0 items-center justify-center rounded-full border bg-clip-padding outline-none transition-colors cursor-pointer",
    "border-[var(--radio-border)] bg-[var(--radio-bg)] text-[var(--radio-dot)]",
    "hover:border-[var(--radio-border-hover)] hover:bg-[var(--radio-bg-hover)]",
    "focus-visible:ring-3 focus-visible:ring-[var(--radio-ring-focus)]",
    "data-[checked]:border-[var(--radio-border-checked)]",
    "data-[disabled]:bg-[var(--radio-bg-disabled)] data-[disabled]:border-[var(--radio-border-disabled)] data-[disabled]:text-[var(--radio-dot-disabled)] data-[disabled]:cursor-not-allowed",
    "aria-invalid:border-[var(--radio-border-error)] aria-invalid:ring-3 aria-invalid:ring-[var(--radio-ring-error)]"
  ),
  {
    variants: {
      displaySize: {
        default: "size-6",
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
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(radioVariants({ displaySize, className }))}
      {...props}
    >
      <RadioPrimitive.Indicator
        className={cn(
          "rounded-full bg-current",
          displaySize === "small" ? "size-2" : "size-2.5"
        )}
      />
    </RadioPrimitive.Root>
  );
}

const RadioGroup = RadioGroupPrimitive;

export { RadioButton, RadioGroup };
