"use client";

import * as React from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";

export interface PageSizeOption {
  value: number;
  label: string;
}

export interface PaginationProps {
  totalItems: number;
  activePage: number;
  pageSize?: number;
  pageSizeOptions?: PageSizeOption[];
  showFirstAndLastNav?: boolean;
  showPageSizeChanger?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (page: number, pageSize: number) => void;
  className?: string;
}

/**
 * Returns a sparse page list with `null` denoting an ellipsis.
 * Shows: first, last, current ±1. Collapses any gap of >1 to "…".
 */
function pageWindow(active: number, total: number): (number | null)[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, active - 2, active - 1, active, active + 1, active + 2]);
  const pages = Array.from(set).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push(null);
    out.push(pages[i]);
  }
  return out;
}

const navButtonCx =
  "inline-flex items-center justify-center size-10 rounded-md border border-[var(--pagination-border)] bg-[var(--pagination-bg)] text-[var(--pagination-chevron)] hover:bg-[var(--pagination-bg-hover)] disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:border-[var(--lifesg-border-focus)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--lifesg-border-focus)_50%,transparent)]";

const pageButtonCx =
  "inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-md border border-[var(--pagination-border)] bg-[var(--pagination-bg)] tabular-nums text-[var(--pagination-text)] hover:bg-[var(--pagination-bg-hover)] outline-none focus-visible:border-[var(--lifesg-border-focus)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--lifesg-border-focus)_50%,transparent)] aria-[current=page]:bg-[var(--pagination-bg-active)] aria-[current=page]:text-[var(--pagination-text-active)] aria-[current=page]:border-[var(--pagination-bg-active)] aria-[current=page]:font-semibold";

function Pagination({
  totalItems,
  activePage,
  pageSize = 10,
  pageSizeOptions = [{ value: 10, label: "10" }, { value: 20, label: "20" }, { value: 50, label: "50" }],
  showFirstAndLastNav,
  showPageSizeChanger,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const active = Math.min(Math.max(activePage, 1), totalPages);
  const pages = pageWindow(active, totalPages);
  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === active) return;
    onPageChange?.(p);
  };
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-2 overflow-x-auto", className)}>
      {showFirstAndLastNav && (
        <button
          type="button"
          aria-label="First page"
          disabled={active === 1}
          onClick={() => go(1)}
          className={navButtonCx}
        >
          <ChevronFirst size={18} />
        </button>
      )}
      <button
        type="button"
        aria-label="Previous page"
        disabled={active === 1}
        onClick={() => go(active - 1)}
        className={navButtonCx}
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="inline-flex items-center justify-center size-10 text-[var(--lifesg-text-subtle)] select-none">
            ⋯
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === active ? "page" : undefined}
            onClick={() => go(p)}
            className={pageButtonCx}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={active === totalPages}
        onClick={() => go(active + 1)}
        className={navButtonCx}
      >
        <ChevronRight size={18} />
      </button>
      {showFirstAndLastNav && (
        <button
          type="button"
          aria-label="Last page"
          disabled={active === totalPages}
          onClick={() => go(totalPages)}
          className={navButtonCx}
        >
          <ChevronLast size={18} />
        </button>
      )}
      {showPageSizeChanger && (
        <div className="ml-auto shrink-0">
          <span className="sr-only">Page size</span>
          <Select
            options={pageSizeOptions.map((o) => ({ value: String(o.value), label: o.label }))}
            selectedOption={(() => {
              const match = pageSizeOptions.find((o) => o.value === pageSize);
              return match ? { value: String(match.value), label: match.label } : null;
            })()}
            onSelectOption={(_, v) => onPageSizeChange?.(1, Number(v))}
            className="h-10 w-20"
          />
        </div>
      )}
    </nav>
  );
}

export { Pagination };
