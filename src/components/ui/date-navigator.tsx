"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface DateNavigatorProps {
  id?: string;
  className?: string;
  selectedDate: string;
  minDate?: string;
  maxDate?: string;
  loading?: boolean;
  showDateAsShortForm?: boolean;
  showCurrentDateAsToday?: boolean;
  view?: "day" | "week";
  onLeftArrowClick: (currentDate: string) => void;
  onRightArrowClick: (currentDate: string) => void;
  onCalendarDateSelect?: (currentDate: string) => void;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isToday(d: Date): boolean {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function startOfWeek(d: Date): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

function formatDate(iso: string, opts: { short: boolean; today: boolean; view: "day" | "week" }): string {
  const d = parseIso(iso);
  if (opts.view === "week") {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const monStart = (opts.short ? MONTHS_SHORT : MONTHS_LONG)[start.getMonth()];
    const monEnd = (opts.short ? MONTHS_SHORT : MONTHS_LONG)[end.getMonth()];
    return start.getMonth() === end.getMonth()
      ? `${start.getDate()} – ${end.getDate()} ${monStart} ${end.getFullYear()}`
      : `${start.getDate()} ${monStart} – ${end.getDate()} ${monEnd} ${end.getFullYear()}`;
  }
  if (opts.today && isToday(d)) return "Today";
  const day = DAYS_SHORT[d.getDay()];
  const month = (opts.short ? MONTHS_SHORT : MONTHS_LONG)[d.getMonth()];
  return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}`;
}

function shiftIso(iso: string, deltaDays: number): string {
  const d = parseIso(iso);
  d.setDate(d.getDate() + deltaDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function DateNavigator({
  id,
  className,
  selectedDate,
  minDate,
  maxDate,
  loading,
  showDateAsShortForm,
  showCurrentDateAsToday,
  view = "day",
  onLeftArrowClick,
  onRightArrowClick,
  onCalendarDateSelect,
}: DateNavigatorProps) {
  const step = view === "week" ? 7 : 1;
  const display = formatDate(selectedDate, {
    short: !!showDateAsShortForm,
    today: !!showCurrentDateAsToday,
    view,
  });

  const minD = minDate ? parseIso(minDate) : undefined;
  const maxD = maxDate ? parseIso(maxDate) : undefined;
  const cur = parseIso(selectedDate);
  const canGoBack = !loading && (!minD || shiftDays(cur, -step) >= minD);
  const canGoForward = !loading && (!maxD || shiftDays(cur, step) <= maxD);

  return (
    <div
      id={id}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-[var(--date-navigator-border)] bg-[var(--date-navigator-bg)] p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Previous"
        disabled={!canGoBack}
        onClick={() => onLeftArrowClick(shiftIso(selectedDate, -step))}
        className="size-10 inline-flex items-center justify-center rounded-md hover:bg-[var(--date-navigator-bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-[var(--date-navigator-ring-focus)]"
      >
        <ChevronLeft className="size-5" />
      </button>

      {onCalendarDateSelect ? (
        <Popover.Root>
          <Popover.Trigger
            className="inline-flex items-center gap-2 px-3 h-10 rounded-md text-sm font-semibold hover:bg-[var(--date-navigator-bg-hover)] cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-[var(--date-navigator-ring-focus)]"
            disabled={loading}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            <span className="min-w-[12rem] text-center">{display}</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} align="center">
              <Popover.Popup className="rounded-md border border-[var(--date-navigator-border)] bg-[var(--lifesg-bg)] shadow-lg outline-none">
                <Calendar
                  variant="single"
                  styleType="no-border"
                  value={selectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(v) => v && onCalendarDateSelect(v)}
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      ) : (
        <span className="px-3 h-10 inline-flex items-center text-sm font-semibold min-w-[12rem] justify-center">
          {display}
        </span>
      )}

      <button
        type="button"
        aria-label="Next"
        disabled={!canGoForward}
        onClick={() => onRightArrowClick(shiftIso(selectedDate, step))}
        className="size-10 inline-flex items-center justify-center rounded-md hover:bg-[var(--date-navigator-bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-[var(--date-navigator-ring-focus)]"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function shiftDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export { DateNavigator };
