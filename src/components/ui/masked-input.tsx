"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

interface MaskedInputOwnProps {
  value?: string;
  /** [start, end) — chars in this index range are masked. */
  maskRange?: [number, number];
  /** [start, end) — chars OUTSIDE this index range are masked. */
  unmaskRange?: [number, number];
  /** Chars matching this regex are masked. */
  maskRegex?: RegExp;
  /** Mask character. @default "•" */
  maskChar?: string;
  /** Start unmasked. @default false */
  disableMask?: boolean;
  iconMask?: React.ReactNode;
  iconUnmask?: React.ReactNode;
  onMask?: () => void;
  onUnmask?: () => void;
}

type MaskedInputProps = Omit<React.ComponentProps<typeof Input>, "type" | "value"> &
  MaskedInputOwnProps;

function applyMask(
  value: string,
  opts: {
    maskRange?: [number, number];
    unmaskRange?: [number, number];
    maskRegex?: RegExp;
    maskChar: string;
  }
): string {
  const { maskRange, unmaskRange, maskRegex, maskChar } = opts;
  return value
    .split("")
    .map((ch, i) => {
      if (maskRange) return i >= maskRange[0] && i < maskRange[1] ? maskChar : ch;
      if (unmaskRange) return i >= unmaskRange[0] && i < unmaskRange[1] ? ch : maskChar;
      if (maskRegex) return maskRegex.test(ch) ? maskChar : ch;
      return maskChar;
    })
    .join("");
}

function MaskedInput({
  value = "",
  maskRange,
  unmaskRange,
  maskRegex,
  maskChar = "•",
  disableMask = false,
  iconMask,
  iconUnmask,
  onMask,
  onUnmask,
  className,
  readOnly,
  ...props
}: MaskedInputProps) {
  const [masked, setMasked] = React.useState(!disableMask);
  const display = masked
    ? applyMask(value, { maskRange, unmaskRange, maskRegex, maskChar })
    : value;
  const toggle = () => {
    setMasked((m) => {
      const next = !m;
      if (next) onMask?.();
      else onUnmask?.();
      return next;
    });
  };
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        value={display}
        readOnly={readOnly || masked}
        {...props}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={masked ? "Reveal" : "Hide"}
        aria-pressed={!masked}
        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-8 rounded text-[var(--input-icon)] hover:bg-[var(--input-icon-hover-bg)]"
      >
        {masked
          ? iconUnmask ?? <Eye className="size-4" />
          : iconMask ?? <EyeOff className="size-4" />}
      </button>
    </div>
  );
}

function FormMaskedInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & MaskedInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <MaskedInput {...rest} />
    </FormField>
  );
}

export { MaskedInput, FormMaskedInput };
