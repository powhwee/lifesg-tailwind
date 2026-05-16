"use client";

import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "@/components/ui/popover";
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

interface Segments {
  day: string;
  month: string;
  year: string;
}

const EMPTY: Segments = { day: "", month: "", year: "" };

function parseValue(value: string | undefined): Segments {
  if (!value) return EMPTY;
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return EMPTY;
  return { day: d, month: m, year: y };
}

function isComplete(s: Segments): boolean {
  return s.day.length > 0 && s.month.length > 0 && s.year.length === 4;
}

function isEmpty(s: Segments): boolean {
  return !s.day && !s.month && !s.year;
}

function toIso(s: Segments): string {
  if (!isComplete(s)) return "";
  return `${s.year.padStart(4, "0")}-${s.month.padStart(2, "0")}-${s.day.padStart(2, "0")}`;
}

function fromIsoDate(s: string | undefined): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIsoDate(d: Date | undefined): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
    "size-8 inline-flex items-center justify-center rounded-md hover:bg-calendar-bg-hover cursor-pointer",
  button_next:
    "size-8 inline-flex items-center justify-center rounded-md hover:bg-calendar-bg-hover cursor-pointer",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "size-9 text-xs text-calendar-text-subtle font-normal flex items-center justify-center",
  week: "flex",
  day: "size-9 p-0 text-sm",
  day_button: cn(
    "size-9 inline-flex items-center justify-center rounded-md cursor-pointer text-sm",
    "hover:bg-calendar-bg-hover",
    "focus-visible:ring-3 focus-visible:ring-calendar-ring-focus focus-visible:outline-none"
  ),
  today: "font-semibold text-calendar-text-today",
  selected:
    "[&>button]:bg-calendar-bg-selected [&>button]:text-calendar-text-selected",
  range_start:
    "[&>button]:bg-calendar-bg-selected [&>button]:text-calendar-text-selected",
  range_end:
    "[&>button]:bg-calendar-bg-selected [&>button]:text-calendar-text-selected",
  range_middle:
    "[&>button]:bg-calendar-bg-hover [&>button]:text-calendar-text",
  outside: "text-calendar-text-disabled",
  disabled:
    "text-calendar-text-disabled cursor-not-allowed [&>button]:cursor-not-allowed [&>button:hover]:bg-transparent",
  hidden: "invisible",
};

interface SegmentedGroupProps {
  segments: Segments;
  prefix: "Start" | "End";
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (next: Segments) => void;
  onFocus: () => void;
  dayRef: React.RefObject<HTMLInputElement | null>;
  monthRef: React.RefObject<HTMLInputElement | null>;
  yearRef: React.RefObject<HTMLInputElement | null>;
  prevYearRef?: React.RefObject<HTMLInputElement | null>;
}

const segmentCx =
  "bg-transparent border-0 outline-none p-0 text-center text-input leading-input text-input-text placeholder:text-input-text-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled";

const separatorCx =
  "select-none text-input leading-input text-input-text-placeholder";

function SegmentedGroup({
  segments,
  prefix,
  disabled,
  readOnly,
  onChange,
  onFocus,
  dayRef,
  monthRef,
  yearRef,
}: SegmentedGroupProps) {
  const handle = (
    key: keyof Segments,
    raw: string,
    maxLen: number,
    nextRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    const digits = raw.replace(/\D/g, "").slice(0, maxLen);
    onChange({ ...segments, [key]: digits });
    if (digits.length === maxLen && nextRef?.current) nextRef.current.focus();
  };
  const backspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && prevRef?.current) {
      prevRef.current.focus();
      prevRef.current.setSelectionRange(prevRef.current.value.length, prevRef.current.value.length);
    }
  };
  const labelDay = `${prefix} Day`;
  const labelMonth = `${prefix} Month`;
  const labelYear = `${prefix} Year`;
  return (
    <div className="flex items-center gap-1">
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={labelDay}
        placeholder="DD"
        maxLength={2}
        disabled={disabled}
        readOnly={readOnly}
        value={segments.day}
        onChange={(e) => handle("day", e.target.value, 2, monthRef)}
        onFocus={onFocus}
        className={cn(segmentCx, "w-7")}
      />
      <span aria-hidden="true" className={separatorCx}>/</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={labelMonth}
        placeholder="MM"
        maxLength={2}
        disabled={disabled}
        readOnly={readOnly}
        value={segments.month}
        onChange={(e) => handle("month", e.target.value, 2, yearRef)}
        onKeyDown={(e) => backspace(e, dayRef)}
        onFocus={onFocus}
        className={cn(segmentCx, "w-8")}
      />
      <span aria-hidden="true" className={separatorCx}>/</span>
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={labelYear}
        placeholder="YYYY"
        maxLength={4}
        disabled={disabled}
        readOnly={readOnly}
        value={segments.year}
        onChange={(e) => handle("year", e.target.value, 4, null)}
        onKeyDown={(e) => backspace(e, monthRef)}
        onFocus={onFocus}
        className={cn(segmentCx, "w-12")}
      />
    </div>
  );
}

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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const startDayRef = React.useRef<HTMLInputElement | null>(null);
  const startMonthRef = React.useRef<HTMLInputElement | null>(null);
  const startYearRef = React.useRef<HTMLInputElement | null>(null);
  const endDayRef = React.useRef<HTMLInputElement | null>(null);
  const endMonthRef = React.useRef<HTMLInputElement | null>(null);
  const endYearRef = React.useRef<HTMLInputElement | null>(null);

  const [start, setStart] = React.useState<Segments>(parseValue(value));
  const [end, setEnd] = React.useState<Segments>(parseValue(valueEnd));
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setStart(parseValue(value));
    setEnd(parseValue(valueEnd));
  }, [value, valueEnd]);

  const fireChange = (s: Segments, e: Segments) => {
    onChange?.(isComplete(s) ? toIso(s) : "", isComplete(e) ? toIso(e) : "");
  };

  const onStartChange = (next: Segments) => {
    setStart(next);
    fireChange(next, end);
  };
  const onEndChange = (next: Segments) => {
    setEnd(next);
    fireChange(start, next);
  };

  const openIfAllowed = () => {
    if (!disabled && !readOnly) setOpen(true);
  };

  const selected: DateRange = {
    from: fromIsoDate(value),
    to: fromIsoDate(valueEnd),
  };

  const disabledDates = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    const items: Matcher[] = [];
    if (minDate) items.push({ before: fromIsoDate(minDate)! });
    if (maxDate) items.push({ after: fromIsoDate(maxDate)! });
    return items.length === 0 ? undefined : items;
  }, [minDate, maxDate]);

  const startEmpty = isEmpty(start);
  const endEmpty = isEmpty(end);

  return (
    <Popover open={open} onOpenChange={(o) => { if (!disabled && !readOnly) setOpen(o); }}>
      <div
        ref={containerRef}
        id={id}
        className={cn(
          "h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x flex items-center gap-3 hover:border-input-border-hover focus-within:border-input-border-focus focus-within:ring-3 focus-within:ring-input-ring-focus",
          error && "border-input-border-error ring-3 ring-input-ring-error",
          disabled && "bg-input-bg-disabled border-input-border-disabled cursor-not-allowed",
          className
        )}
      >
        {startEmpty ? (
          <button
            type="button"
            disabled={disabled || readOnly}
            onClick={() => {
              startDayRef.current?.focus();
              openIfAllowed();
            }}
            className={cn(
              "flex-1 text-left text-input leading-input text-input-text-placeholder disabled:cursor-not-allowed"
            )}
          >
            From
          </button>
        ) : (
          <SegmentedGroup
            segments={start}
            prefix="Start"
            disabled={disabled}
            readOnly={readOnly}
            onChange={onStartChange}
            onFocus={openIfAllowed}
            dayRef={startDayRef}
            monthRef={startMonthRef}
            yearRef={startYearRef}
          />
        )}
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-input-text-placeholder" />
        {endEmpty ? (
          <button
            type="button"
            disabled={disabled || readOnly}
            onClick={() => {
              endDayRef.current?.focus();
              openIfAllowed();
            }}
            className={cn(
              "flex-1 text-left text-input leading-input text-input-text-placeholder disabled:cursor-not-allowed"
            )}
          >
            To
          </button>
        ) : (
          <SegmentedGroup
            segments={end}
            prefix="End"
            disabled={disabled}
            readOnly={readOnly}
            onChange={onEndChange}
            onFocus={openIfAllowed}
            dayRef={endDayRef}
            monthRef={endMonthRef}
            yearRef={endYearRef}
          />
        )}
      </div>
      {name ? (
        <>
          <input type="hidden" name={`${name}-start`} value={value ?? ""} />
          <input type="hidden" name={`${name}-end`} value={valueEnd ?? ""} />
        </>
      ) : null}
      <PopoverContent anchor={containerRef} className="p-3">
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={(range) => {
            const s = toIsoDate(range?.from);
            const e = toIsoDate(range?.to);
            setStart(parseValue(s));
            setEnd(parseValue(e));
            onChange?.(s, e);
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
