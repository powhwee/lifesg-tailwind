"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

const inputCx =
  "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] text-[length:var(--input-font-size)] leading-[var(--input-line-height)] text-[var(--input-text)] placeholder:text-[var(--input-text-placeholder)] outline-none transition-colors hover:border-[var(--input-border-hover)] focus-visible:border-[var(--input-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--input-ring-focus)] disabled:cursor-not-allowed disabled:bg-[var(--input-bg-disabled)] disabled:text-[var(--input-text-disabled)] disabled:border-[var(--input-border-disabled)] aria-invalid:border-[var(--input-border-error)] aria-invalid:ring-3 aria-invalid:ring-[var(--input-ring-error)] read-only:bg-[var(--input-bg-readonly)]";

interface InputOwnProps {
  allowClear?: boolean;
  onClear?: () => void;
}

type InputProps = React.ComponentProps<typeof InputPrimitive> & InputOwnProps;

function Input({ className, allowClear, onClear, value, ...props }: InputProps) {
  const hasValue = value !== undefined && value !== "" && value !== null;
  const showClear = allowClear && hasValue && !props.disabled && !props.readOnly;

  if (allowClear) {
    return (
      <div className={cn("relative w-full", className)}>
        <InputPrimitive
          data-slot="input"
          value={value}
          {...props}
          className={cn(inputCx, showClear && "pr-10")}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-8 rounded text-[var(--input-icon)] hover:bg-[var(--input-icon-hover-bg)]"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <InputPrimitive
      data-slot="input"
      value={value}
      {...props}
      className={cn(inputCx, className)}
    />
  );
}

function FormInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...inputProps
}: FormFieldProps & InputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <Input {...inputProps} />
    </FormField>
  );
}

export { Input, FormInput };
