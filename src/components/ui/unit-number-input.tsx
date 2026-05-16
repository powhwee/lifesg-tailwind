"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

export interface UnitNumberInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Returns [floor, unit] in parallel with onChange. */
  onChangeRaw?: (value: [string, string]) => void;
  onBlur?: (value: string) => void;
  onBlurRaw?: (value: [string, string]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
}

function parseValue(value: string | undefined): [string, string] {
  if (!value) return ["", ""];
  const [a, b] = value.split("-");
  return [a ?? "", b ?? ""];
}

function format(floor: string, unit: string): string {
  if (!floor && !unit) return "";
  return `${floor}-${unit}`;
}

function UnitNumberInput({
  value,
  defaultValue,
  onChange,
  onChangeRaw,
  onBlur,
  onBlurRaw,
  disabled,
  readOnly,
  error,
  placeholder,
  name,
  id,
  className,
}: UnitNumberInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<[string, string]>(
    parseValue(value ?? defaultValue)
  );

  React.useEffect(() => {
    if (isControlled) setInternal(parseValue(value));
  }, [isControlled, value]);

  const update = (next: [string, string]) => {
    setInternal(next);
    const formatted = format(next[0], next[1]);
    onChange?.(formatted);
    onChangeRaw?.(next);
  };

  const handleBlur = () => {
    const formatted = format(internal[0], internal[1]);
    onBlur?.(formatted);
    onBlurRaw?.(internal);
  };

  const inputCx =
    "h-input-height bg-transparent border-0 outline-none px-1 text-center text-input leading-input text-input-text placeholder:text-input-text-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled";

  return (
    <div
      className={cn(
        "inline-flex items-stretch w-fit rounded-input border border-input-border bg-input-bg hover:border-input-border-hover focus-within:border-input-border-focus focus-within:ring-3 focus-within:ring-input-ring-focus",
        error && "border-input-border-error ring-3 ring-input-ring-error",
        disabled && "bg-input-bg-disabled border-input-border-disabled cursor-not-allowed",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="grid place-items-center pl-3 text-input-text select-none text-input"
      >
        #
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={internal[0]}
        onChange={(e) => update([e.target.value, internal[1]])}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder ? placeholder.split("-")[0] : "00"}
        maxLength={3}
        name={name ? `${name}-floor` : undefined}
        id={id ? `${id}-floor` : undefined}
        aria-label="Floor"
        className={cn(inputCx, "w-10")}
      />
      <span
        aria-hidden="true"
        className="grid place-items-center px-1 text-input-text-placeholder select-none"
      >
        -
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={internal[1]}
        onChange={(e) => update([internal[0], e.target.value])}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder ? placeholder.split("-")[1] : "8888"}
        maxLength={5}
        name={name ? `${name}-unit` : undefined}
        id={id ? `${id}-unit` : undefined}
        aria-label="Unit"
        className={cn(inputCx, "w-24 pr-3")}
      />
    </div>
  );
}

function FormUnitNumberInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & UnitNumberInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <UnitNumberInput {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { UnitNumberInput, FormUnitNumberInput };
