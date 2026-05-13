"use client";

import * as React from "react";
import { DayPicker, type Matcher, type DateLibOptions } from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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

  const disabled = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    const items: Matcher[] = [];
    if (minDate) items.push({ before: fromIso(minDate)! });
    if (maxDate) items.push({ after: fromIso(maxDate)! });
    if (disabledDates) for (const s of disabledDates) {
      const d = fromIso(s);
      if (d) items.push(d);
    }
    return items.length === 0 ? undefined : items;
  }, [minDate, maxDate, disabledDates]);

  const baseClasses = cn(
    "relative p-3 bg-calendar-bg text-calendar-text min-w-calendar-min-width",
    styleType === "bordered" && "border border-calendar-border rounded-md",
    className
  );

  const dayPickerClassNames = {
    root: "rdp-root relative",
    months: "flex flex-col",
    month: "space-y-3",
    month_caption: "relative flex items-center gap-2 px-1 pt-1",
    caption_label: "inline-flex items-center gap-0.5 font-semibold text-sm pl-1.5 pr-1 py-0.5 rounded-md hover:bg-calendar-bg-hover cursor-pointer",
    dropdowns: "flex items-center gap-2",
    dropdown_root: "relative inline-flex items-center",
    dropdown: "absolute inset-0 opacity-0 cursor-pointer appearance-none",
    chevron: "size-3 pointer-events-none",
    nav: "flex items-center gap-1 absolute right-1 top-1",
    button_previous: "size-7 inline-flex items-center justify-center rounded-md hover:bg-calendar-bg-hover cursor-pointer text-calendar-text",
    button_next: "size-7 inline-flex items-center justify-center rounded-md hover:bg-calendar-bg-hover cursor-pointer text-calendar-text",
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday: "flex-1 h-9 text-xs text-calendar-text-subtle font-normal flex items-center justify-center",
    week: "flex",
    day: "flex-1 p-0.5 text-sm relative",
    day_button: cn(
      "w-full h-9 inline-flex items-center justify-center rounded-md cursor-pointer text-sm",
      "hover:bg-calendar-bg-hover",
      "focus-visible:ring-3 focus-visible:ring-calendar-ring-focus focus-visible:outline-none"
    ),
    today: "font-semibold text-calendar-text-today after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-calendar-text-today",
    selected: "[&>button]:bg-calendar-bg-selected [&>button]:text-calendar-text-selected [&>button:hover]:bg-calendar-bg-selected-hover",
    outside: "text-calendar-text-disabled",
    disabled: "text-calendar-text-disabled cursor-not-allowed [&>button]:cursor-not-allowed [&>button:hover]:bg-transparent",
    hidden: "invisible",
  };

  const formatWeekdayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
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
          captionLayout="dropdown"
          showOutsideDays
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
          formatters={{ formatWeekdayName }}
          components={{
            Chevron: ({ orientation, className: chevronClass }) => {
              if (orientation === "left") return <ChevronLeft className={cn("size-4", chevronClass)} />;
              if (orientation === "right") return <ChevronRight className={cn("size-4", chevronClass)} />;
              return <ChevronDown className={cn("size-4", chevronClass)} />;
            },
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
        captionLayout="dropdown"
        showOutsideDays
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
        formatters={{ formatWeekdayName }}
        components={{
          Chevron: ({ orientation, className: chevronClass }) => {
            if (orientation === "left") return <ChevronLeft className={cn("size-4", chevronClass)} />;
            if (orientation === "right") return <ChevronRight className={cn("size-4", chevronClass)} />;
            return <ChevronDown className={cn("size-4", chevronClass)} />;
          },
        }}
      />
    </div>
  );
}

export { Calendar };
