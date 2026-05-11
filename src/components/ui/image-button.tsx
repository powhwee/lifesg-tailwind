"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Check } from "lucide-react";
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
        "group/image-button relative aspect-square overflow-hidden rounded-md cursor-pointer outline-none transition-all",
        "border-2 border-[var(--image-button-border)]",
        "hover:border-[var(--image-button-border-hover)]",
        "focus-visible:ring-3 focus-visible:ring-[var(--image-button-ring-focus)]",
        "data-[selected]:border-[var(--image-button-border-selected)]",
        "aria-invalid:border-[var(--image-button-border-error)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt="" className="absolute inset-0 size-full object-cover" />
      {selected && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full",
            "bg-[var(--image-button-bg-checkmark)] text-[var(--image-button-text-checkmark)]"
          )}
        >
          <Check className="size-4" strokeWidth={3} />
        </span>
      )}
    </ButtonPrimitive>
  );
}

export { ImageButton };
