"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function fromIso(s: string | undefined): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIso(d: Date | undefined): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface CalendarBaseProps {
  className?: string;
  id?: string;
  styleType?: "no-border" | "bordered";
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  onHover?: (value: string) => void;
  onYearMonthDisplayChange?: (value: { year: number; month: number }) => void;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  variant?: "single";
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

export interface CalendarMultiProps extends CalendarBaseProps {
  variant: "multi";
  values?: string[];
  minSelectable?: number;
  maxSelectable?: number;
  onChange?: (values: string[]) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarMultiProps;

function isMulti(p: CalendarProps): p is CalendarMultiProps {
  return p.variant === "multi";
}

function Calendar(props: CalendarProps) {
  const { className, id, styleType = "no-border", minDate, maxDate, disabledDates, onHover, onYearMonthDisplayChange } = props;

  const disabled = React.useMemo(() => {
    const items: Array<{ before?: Date; after?: Date } | Date> = [];
    if (minDate) items.push({ before: fromIso(minDate)! });
    if (maxDate) items.push({ after: fromIso(maxDate)! });
    if (disabledDates) for (const s of disabledDates) {
      const d = fromIso(s);
      if (d) items.push(d);
    }
    return items.length === 0 ? undefined : items;
  }, [minDate, maxDate, disabledDates]);

  const baseClasses = cn(
    "p-3 bg-[var(--calendar-bg)] text-[var(--calendar-text)]",
    styleType === "bordered" && "border border-[var(--calendar-border)] rounded-md",
    className
  );

  const dayPickerClassNames = {
    root: "rdp-root",
    months: "flex flex-col",
    month: "space-y-3",
    month_caption: "flex items-center justify-center px-2 pt-1 text-sm font-semibold",
    caption_label: "text-base font-semibold",
    nav: "flex items-center justify-between absolute left-3 right-3 top-3",
    button_previous: "size-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--calendar-bg-hover)] cursor-pointer",
    button_next: "size-8 inline-flex items-center justify-center rounded-md hover:bg-[var(--calendar-bg-hover)] cursor-pointer",
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday: "size-9 text-xs text-[var(--calendar-text-subtle)] font-normal flex items-center justify-center",
    week: "flex",
    day: "size-9 p-0 text-sm",
    day_button: cn(
      "size-9 inline-flex items-center justify-center rounded-md cursor-pointer text-sm",
      "hover:bg-[var(--calendar-bg-hover)]",
      "focus-visible:ring-3 focus-visible:ring-[var(--calendar-ring-focus)] focus-visible:outline-none"
    ),
    today: "font-semibold text-[var(--calendar-text-today)]",
    selected: "bg-[var(--calendar-bg-selected)] text-[var(--calendar-text-selected)] [&>button]:bg-[var(--calendar-bg-selected)] [&>button]:text-[var(--calendar-text-selected)] [&>button:hover]:bg-[var(--calendar-bg-selected-hover)]",
    outside: "text-[var(--calendar-text-disabled)]",
    disabled: "text-[var(--calendar-text-disabled)] cursor-not-allowed [&>button]:cursor-not-allowed [&>button:hover]:bg-transparent",
    hidden: "invisible",
  };

  const handleMonthChange = (m: Date) => {
    onYearMonthDisplayChange?.({ year: m.getFullYear(), month: m.getMonth() + 1 });
  };

  const handleDayMouseEnter = (d: Date) => onHover?.(toIso(d));

  if (isMulti(props)) {
    const selected = (props.values ?? []).map((s) => fromIso(s)).filter((d): d is Date => !!d);
    return (
      <div id={id} className={baseClasses} data-slot="calendar">
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={(dates) => {
            const next = (dates ?? []).map(toIso);
            const min = props.minSelectable ?? 0;
            const max = props.maxSelectable ?? Infinity;
            if (next.length < min || next.length > max) return;
            props.onChange?.(next);
          }}
          disabled={disabled}
          onMonthChange={handleMonthChange}
          onDayMouseEnter={handleDayMouseEnter}
          classNames={dayPickerClassNames}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
          }}
        />
      </div>
    );
  }

  const selected = fromIso(props.value);
  return (
    <div id={id} className={baseClasses} data-slot="calendar">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(d) => {
          const v = toIso(d);
          props.onChange?.(v);
          props.onSelect?.(v);
        }}
        disabled={disabled}
        onMonthChange={handleMonthChange}
        onDayMouseEnter={handleDayMouseEnter}
        classNames={dayPickerClassNames}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
        }}
      />
    </div>
  );
}

export { Calendar };
