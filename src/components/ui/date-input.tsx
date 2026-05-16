"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
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
  /** When true, calendar shows Cancel + Done buttons; selection only commits on Done. */
  withButton?: boolean;
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

function toIso(s: Segments): string {
  if (!isComplete(s)) return "";
  return `${s.year.padStart(4, "0")}-${s.month.padStart(2, "0")}-${s.day.padStart(2, "0")}`;
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
  withButton = false,
  className,
  id,
  name,
}: DateInputProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dayRef = React.useRef<HTMLInputElement | null>(null);
  const monthRef = React.useRef<HTMLInputElement | null>(null);
  const yearRef = React.useRef<HTMLInputElement | null>(null);

  const [segments, setSegments] = React.useState<Segments>(parseValue(value));
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(value);

  React.useEffect(() => {
    setSegments(parseValue(value));
    setPending(value);
  }, [value]);

  const commit = (next: Segments) => {
    setSegments(next);
    if (isComplete(next)) onChange?.(toIso(next));
    else if (!next.day && !next.month && !next.year) onChange?.("");
  };

  const handleSegmentChange = (
    key: keyof Segments,
    raw: string,
    maxLen: number,
    nextRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    const digits = raw.replace(/\D/g, "").slice(0, maxLen);
    const next = { ...segments, [key]: digits };
    commit(next);
    if (digits.length === maxLen && nextRef?.current) nextRef.current.focus();
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && prevRef?.current) {
      prevRef.current.focus();
      prevRef.current.setSelectionRange(prevRef.current.value.length, prevRef.current.value.length);
    }
  };

  const openIfAllowed = () => {
    if (!disabled && !readOnly) setOpen(true);
  };

  const segmentCx =
    "bg-transparent border-0 outline-none p-0 text-center text-[length:var(--input-font-size)] leading-[var(--input-line-height)] text-[var(--input-text)] placeholder:text-[var(--input-text-placeholder)] disabled:cursor-not-allowed disabled:text-[var(--input-text-disabled)]";

  const separatorCx =
    "select-none text-[length:var(--input-font-size)] leading-[var(--input-line-height)] text-[var(--input-text-placeholder)]";

  return (
    <Popover open={open} onOpenChange={(o) => { if (!disabled && !readOnly) setOpen(o); }}>
      <div
        ref={containerRef}
        className={cn(
          "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] flex items-center gap-1 hover:border-[var(--input-border-hover)] focus-within:border-[var(--input-border-focus)] focus-within:ring-3 focus-within:ring-[var(--input-ring-focus)]",
          error && "border-[var(--input-border-error)] ring-3 ring-[var(--input-ring-error)]",
          disabled && "bg-[var(--input-bg-disabled)] border-[var(--input-border-disabled)] cursor-not-allowed",
          className
        )}
      >
        <input
          ref={dayRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Day"
          placeholder="DD"
          maxLength={2}
          disabled={disabled}
          readOnly={readOnly}
          value={segments.day}
          onChange={(e) => handleSegmentChange("day", e.target.value, 2, monthRef)}
          onFocus={openIfAllowed}
          className={cn(segmentCx, "w-7")}
        />
        <span aria-hidden="true" className={separatorCx}>/</span>
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Month"
          placeholder="MM"
          maxLength={2}
          disabled={disabled}
          readOnly={readOnly}
          value={segments.month}
          onChange={(e) => handleSegmentChange("month", e.target.value, 2, yearRef)}
          onKeyDown={(e) => handleBackspace(e, dayRef)}
          onFocus={openIfAllowed}
          className={cn(segmentCx, "w-8")}
        />
        <span aria-hidden="true" className={separatorCx}>/</span>
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Year"
          placeholder="YYYY"
          maxLength={4}
          disabled={disabled}
          readOnly={readOnly}
          value={segments.year}
          onChange={(e) => handleSegmentChange("year", e.target.value, 4, null)}
          onKeyDown={(e) => handleBackspace(e, monthRef)}
          onFocus={openIfAllowed}
          className={cn(segmentCx, "w-12")}
        />
      </div>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <PopoverContent anchor={containerRef}>
        <Calendar
          value={withButton ? pending : value}
          onChange={(v) => {
            if (withButton) {
              setPending(v);
            } else {
              setSegments(parseValue(v));
              onChange?.(v);
              setOpen(false);
            }
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
              onClick={() => {
                const next = pending ?? "";
                setSegments(parseValue(next));
                onChange?.(next);
                setOpen(false);
              }}
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
