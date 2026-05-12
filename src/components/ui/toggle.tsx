"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioButton } from "@/components/ui/radio-button";

export type ToggleType = "checkbox" | "radio" | "yes" | "no";
export type ToggleStyleType = "default" | "no-border";

const toggleVariants = cva(
  cn(
    "group/toggle relative flex w-full cursor-pointer items-start gap-4 rounded-md p-4 transition-colors",
    "border bg-[var(--toggle-bg)] border-[var(--toggle-border)] text-[var(--toggle-text)]",
    "hover:bg-[var(--toggle-bg-hover)] hover:border-[var(--toggle-border-hover)]",
    "has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-[var(--toggle-ring-focus)]",
    "has-[[data-checked]]:bg-[var(--toggle-bg-checked)] has-[[data-checked]]:border-[var(--toggle-border-checked)] has-[[data-checked]]:border-l-[3px] has-[[data-checked]]:border-l-[var(--lifesg-border-primary)]",
    "[&:has([data-disabled])]:bg-[var(--toggle-bg-disabled)] [&:has([data-disabled])]:border-[var(--toggle-border-disabled)] [&:has([data-disabled])]:text-[var(--toggle-text-disabled)] [&:has([data-disabled])]:cursor-not-allowed"
  ),
  {
    variants: {
      styleType: {
        default: "",
        "no-border": "border-transparent bg-transparent",
      },
      error: {
        true: "border-[var(--toggle-border-error)] bg-[var(--toggle-bg-error)]",
        false: "",
      },
    },
    defaultVariants: { styleType: "default", error: false },
  }
);

export interface ToggleProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  type?: ToggleType;
  /** Children = the main label content */
  children: React.ReactNode;
  /** Optional secondary line below the label */
  subLabel?: React.ReactNode;
  /** Optional sub-content. Renders below label when toggle is checked. */
  compositeSection?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  /** RadioGroup value when type="radio". */
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
}

function Indicator({ type, displaySize }: { type: ToggleType; displaySize: "default" | "small" }) {
  if (type === "radio") return <RadioButton value={"" as never} displaySize={displaySize} />;
  if (type === "checkbox") return <Checkbox displaySize={displaySize} />;
  // "yes" / "no" — visual disc with icon, behaves like a checkbox
  const Icon = type === "yes" ? Check : X;
  const tone = type === "yes" ? "bg-[var(--lifesg-success-50)]" : "bg-[var(--lifesg-error-50)]";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-white",
        displaySize === "small" ? "size-5" : "size-6",
        tone
      )}
    >
      <Icon className={displaySize === "small" ? "size-3" : "size-4"} strokeWidth={3} />
    </span>
  );
}

function Toggle({
  type = "checkbox",
  styleType,
  error,
  children,
  subLabel,
  compositeSection,
  checked,
  defaultChecked,
  disabled,
  name,
  value,
  onChange,
  onCheckedChange,
  className,
  ...labelProps
}: ToggleProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(e);
    onCheckedChange?.(next);
  };

  const inputType = type === "radio" ? "radio" : "checkbox";
  return (
    <label
      data-slot="toggle"
      data-checked={isChecked || undefined}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      className={cn(toggleVariants({ styleType, error, className }))}
      {...labelProps}
    >
      <input
        ref={inputRef}
        type={inputType}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only peer"
        aria-invalid={error || undefined}
      />
      <span className="flex flex-col gap-1 min-w-0 flex-1">
        <span className={cn("text-base font-semibold", isChecked && "text-[var(--lifesg-text-primary)]")}>{children}</span>
        {subLabel && <span className="text-sm text-[var(--lifesg-text-subtle)]">{subLabel}</span>}
        {isChecked && compositeSection && (
          <span className="mt-3 block border-t border-[var(--toggle-border)] pt-3 text-sm">
            {compositeSection}
          </span>
        )}
      </span>
    </label>
  );
}

export { Toggle };
