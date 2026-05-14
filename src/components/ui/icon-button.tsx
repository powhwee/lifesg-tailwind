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
    "focus-visible:ring-3 focus-visible:ring-icon-button-ring-focus",
    "disabled:pointer-events-none disabled:bg-icon-button-bg-disabled disabled:text-icon-button-text-disabled",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      styleType: {
        primary:
          "bg-icon-button-bg-primary text-icon-button-text-primary hover:bg-icon-button-bg-primary-hover",
        secondary:
          "bg-icon-button-bg-secondary text-icon-button-text-secondary border border-icon-button-border-secondary hover:bg-icon-button-bg-secondary-hover",
        light:
          "bg-icon-button-bg-light text-icon-button-text-light hover:bg-icon-button-bg-light-hover",
      },
      sizeType: {
        large:   "size-20 [&_svg:not([class*='size-'])]:size-8",
        default: "size-14 [&_svg:not([class*='size-'])]:size-6",
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
