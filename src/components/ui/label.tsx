import * as React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  disabled,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { disabled?: boolean }) {
  return (
    <label
      data-slot="label"
      data-disabled={disabled || undefined}
      className={cn(
        "inline-flex items-center gap-2 text-[length:var(--field-label-font-size)] leading-[var(--field-label-line-height)] font-semibold text-[var(--field-text-label)]",
        "data-[disabled]:text-[var(--field-text-disabled)] data-[disabled]:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Label };
