"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

export interface DateInputProps {
  /** YYYY-MM-DD. */
  value?: string;
  onChange?: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  placeholder?: string;
  /** When true, calendar shows Cancel + Done buttons; selection only commits on Done. */
  withButton?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

function formatDisplay(value: string | undefined): string {
  if (!value) return "";
  try {
    return format(parse(value, "yyyy-MM-dd", new Date()), "dd / MM / yyyy");
  } catch {
    return value;
  }
}

function DateInput({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  disabled,
  readOnly,
  error,
  placeholder = "DD / MM / YYYY",
  withButton = false,
  className,
  id,
  name,
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(value);

  React.useEffect(() => {
    setPending(value);
  }, [value]);

  const display = formatDisplay(value);
  const apply = (next: string) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (disabled || readOnly) return;
        setOpen(o);
      }}
    >
      <PopoverTrigger
        render={(triggerProps) => (
          <button
            type="button"
            id={id}
            disabled={disabled}
            {...triggerProps}
            className={cn(
              "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] text-left text-[length:var(--input-font-size)] leading-[var(--input-line-height)] flex items-center justify-between gap-2 hover:border-[var(--input-border-hover)] focus-visible:border-[var(--input-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--input-ring-focus)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)] disabled:text-[var(--input-text-disabled)]",
              error && "border-[var(--input-border-error)] ring-3 ring-[var(--input-ring-error)]",
              className
            )}
          >
            <span
              className={cn(
                display ? "text-[var(--input-text)]" : "text-[var(--input-text-placeholder)]"
              )}
            >
              {display || placeholder}
            </span>
            <CalendarIcon className="size-4 text-[var(--input-icon)] shrink-0" />
          </button>
        )}
      />
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <PopoverContent>
        <Calendar
          value={withButton ? pending : value}
          onChange={(v) => {
            if (withButton) setPending(v);
            else apply(v);
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          styleType="no-border"
        />
        {withButton ? (
          <div className="flex justify-end gap-2 border-t border-border p-2">
            <button
              type="button"
              onClick={() => {
                setPending(value);
                setOpen(false);
              }}
              className="px-3 py-1.5 text-sm rounded hover:bg-[var(--lifesg-bg-hover)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => apply(pending ?? "")}
              className="px-3 py-1.5 text-sm font-semibold rounded bg-[var(--lifesg-bg-primary)] text-[var(--lifesg-text-inverse)] hover:bg-[var(--lifesg-bg-primary-hover)]"
            >
              Done
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function FormDateInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & DateInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <DateInput {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { DateInput, FormDateInput };
