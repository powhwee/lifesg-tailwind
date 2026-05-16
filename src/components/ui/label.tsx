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
        "inline-flex items-center gap-2 text-field-label leading-field-label font-semibold text-field-text-label",
        "data-[disabled]:text-field-text-disabled data-[disabled]:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Label };
