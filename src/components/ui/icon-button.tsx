"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type IconButtonStyleType = "primary" | "secondary" | "light";
export type IconButtonSizeType = "large" | "default" | "small";

const iconButtonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-md transition-colors outline-none cursor-pointer",
    "focus-visible:ring-3 focus-visible:ring-[var(--icon-button-ring-focus)]",
    "disabled:pointer-events-none disabled:bg-[var(--icon-button-bg-disabled)] disabled:text-[var(--icon-button-text-disabled)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      styleType: {
        primary:
          "bg-[var(--icon-button-bg-primary)] text-[var(--icon-button-text-primary)] hover:bg-[var(--icon-button-bg-primary-hover)]",
        secondary:
          "bg-[var(--icon-button-bg-secondary)] text-[var(--icon-button-text-secondary)] border border-[var(--icon-button-border-secondary)] hover:bg-[var(--icon-button-bg-secondary-hover)]",
        light:
          "bg-[var(--icon-button-bg-light)] text-[var(--icon-button-text-light)] hover:bg-[var(--icon-button-bg-light-hover)]",
      },
      sizeType: {
        large:   "size-14 [&_svg:not([class*='size-'])]:size-6",
        default: "size-12 [&_svg:not([class*='size-'])]:size-5",
        small:   "size-10 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { styleType: "primary", sizeType: "default" },
  }
);

export interface IconButtonProps
  extends Omit<React.ComponentProps<typeof ButtonPrimitive>, "render">,
    VariantProps<typeof iconButtonVariants> {}

function IconButton({ className, styleType, sizeType, ...props }: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      className={cn(iconButtonVariants({ styleType, sizeType, className }))}
      {...props}
    />
  );
}

export { IconButton };
