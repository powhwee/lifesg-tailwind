"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@/lib/utils";

export interface ImageButtonProps
  extends Omit<React.ComponentProps<typeof ButtonPrimitive>, "render"> {
  imgSrc: string;
  selected?: boolean;
  error?: boolean;
}

function ImageButton({
  className,
  imgSrc,
  selected,
  error,
  disabled,
  ...props
}: ImageButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="image-button"
      data-selected={selected || undefined}
      data-error={error || undefined}
      disabled={disabled}
      aria-pressed={selected}
      aria-invalid={error || undefined}
      className={cn(
        "group/image-button relative aspect-square overflow-hidden rounded-lg cursor-pointer outline-none transition-all",
        "border border-image-button-border",
        "hover:border-image-button-border-hover",
        "focus-visible:ring-3 focus-visible:ring-image-button-ring-focus",
        "data-[selected]:border-image-button-border-selected",
        "aria-invalid:border-image-button-border-error",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* LifeSG insets the image inside button padding rather than fullbleed:
          24px vertical, 16px horizontal. Matches LifeSG ImageButton chrome. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt="" className="absolute inset-y-6 inset-x-4 object-contain" />
    </ButtonPrimitive>
  );
}

export { ImageButton };
