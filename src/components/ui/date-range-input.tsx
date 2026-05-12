"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parse } from "date-fns";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

export interface DateRangeInputProps {
  /** YYYY-MM-DD. */
  value?: string;
  /** YYYY-MM-DD. */
  valueEnd?: string;
  onChange?: (start: string, end: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

function fromIso(s: string | undefined): Date | undefined {
  if (!s) return undefined;
  try {
    return parse(s, "yyyy-MM-dd", new Date());
  } catch {
    return undefined;
  }
}

function toIso(d: Date | undefined): string {
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
}

function formatDisplay(s: string | undefined): string {
  const d = fromIso(s);
  if (!d) return "";
  return format(d, "d MMM yyyy");
}

const dpClassNames = {
  root: "rdp-root",
  months: "flex flex-col",
  month: "space-y-3",
  month_caption:
    "flex items-center justify-center px-2 pt-1 text-sm font-semibold",
  caption_label: "text-base font-semibold",
  nav: "flex items-center justify-between absolute left-3 right-3 top-3",
  button_previous:
    "size-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--calendar-bg-hover)] cursor-pointer",
  button_next:
    "size-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--calendar-bg-hover)] cursor-pointer",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "size-9 text-xs text-[var(--calendar-text-subtle)] font-normal flex items-center justify-center",
  week: "flex",
  day: "size-9 p-0 text-sm",
  day_button: cn(
    "size-9 inline-flex items-center justify-center rounded-md cursor-pointer text-sm",
    "hover:bg-[var(--calendar-bg-hover)]",
    "focus-visible:ring-3 focus-visible:ring-[var(--calendar-ring-focus)] focus-visible:outline-none"
  ),
  today: "font-semibold text-[var(--calendar-text-today)]",
  selected:
    "[&>button]:bg-[var(--calendar-bg-selected)] [&>button]:text-[var(--calendar-text-selected)]",
  range_start:
    "[&>button]:bg-[var(--calendar-bg-selected)] [&>button]:text-[var(--calendar-text-selected)]",
  range_end:
    "[&>button]:bg-[var(--calendar-bg-selected)] [&>button]:text-[var(--calendar-text-selected)]",
  range_middle:
    "[&>button]:bg-[var(--calendar-bg-hover)] [&>button]:text-[var(--calendar-text)]",
  outside: "text-[var(--calendar-text-disabled)]",
  disabled:
    "text-[var(--calendar-text-disabled)] cursor-not-allowed [&>button]:cursor-not-allowed [&>button:hover]:bg-transparent",
  hidden: "invisible",
};

function DateRangeInput({
  value,
  valueEnd,
  onChange,
  minDate,
  maxDate,
  disabled,
  readOnly,
  error,
  className,
  id,
  name,
}: DateRangeInputProps) {
  const [open, setOpen] = React.useState(false);

  const selected: DateRange = {
    from: fromIso(value),
    to: fromIso(valueEnd),
  };

  const startDisplay = formatDisplay(value);
  const endDisplay = formatDisplay(valueEnd);

  const disabledDates = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    const items: Matcher[] = [];
    if (minDate) items.push({ before: fromIso(minDate)! });
    if (maxDate) items.push({ after: fromIso(maxDate)! });
    return items.length === 0 ? undefined : items;
  }, [minDate, maxDate]);

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
              "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] text-left text-[length:var(--input-font-size)] leading-[var(--input-line-height)] flex items-center gap-2 hover:border-[var(--input-border-hover)] focus-visible:border-[var(--input-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--input-ring-focus)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--input-bg-disabled)] disabled:border-[var(--input-border-disabled)] disabled:text-[var(--input-text-disabled)]",
              error && "border-[var(--input-border-error)] ring-3 ring-[var(--input-ring-error)]",
              className
            )}
          >
            {startDisplay || endDisplay ? (
              <span className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[var(--input-text)]">{startDisplay || "—"}</span>
                <ArrowRight className="size-3.5 text-[var(--input-icon)] shrink-0" />
                <span className="text-[var(--input-text)]">{endDisplay || "—"}</span>
              </span>
            ) : (
              <span className="flex-1 text-[var(--input-text-placeholder)]">
                Select date range
              </span>
            )}
            <CalendarIcon className="size-4 text-[var(--input-icon)] shrink-0" />
          </button>
        )}
      />
      {name ? (
        <>
          <input type="hidden" name={`${name}-start`} value={value ?? ""} />
          <input type="hidden" name={`${name}-end`} value={valueEnd ?? ""} />
        </>
      ) : null}
      <PopoverContent className="p-3">
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={(range) => {
            onChange?.(toIso(range?.from), toIso(range?.to));
            if (range?.from && range?.to) setOpen(false);
          }}
          disabled={disabledDates}
          classNames={dpClassNames}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function FormDateRangeInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & DateRangeInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <DateRangeInput {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { DateRangeInput, FormDateRangeInput };
