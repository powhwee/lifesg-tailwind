"use client";

import * as React from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { ChevronUp, ChevronDown, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorDisplay } from "@/components/ui/error-display";

export type SortIndicatorType = "asc" | "desc";
export type LoadStateType = "loading" | "success";
export interface SortIndicatorsProps { [fieldKey: string]: SortIndicatorType }

interface HeaderItemProps {
  fieldKey: string;
  label: React.ReactNode;
  clickable?: boolean;
  keyColumn?: boolean;
  style?: React.CSSProperties;
}
export type HeaderProps = string | HeaderItemProps;

export interface RowProps {
  id: string | number;
  [fieldKey: string]: string | number | React.ReactNode | ((row: RowProps, render: { isSelected: boolean }) => React.ReactNode) | undefined;
}

export interface DataTableProps {
  id?: string;
  headers: HeaderProps[];
  rows?: RowProps[];
  className?: string;
  selectedIds?: string[];
  disabledIds?: string[];
  enableMultiSelect?: boolean;
  enableSelectAll?: boolean;
  enableActionBar?: boolean;
  actionBarContent?: React.ReactNode;
  loadState?: LoadStateType;
  sortIndicators?: SortIndicatorsProps;
  alternatingRows?: boolean;
  onHeaderClick?: (fieldKey: string) => void;
  onSelect?: (rowId: string, isSelected: boolean) => void;
  onSelectAll?: (isAllSelected: boolean) => void;
  onClearSelectionClick?: () => void;
  emptyView?: React.ReactNode;
  renderCustomEmptyView?: () => React.ReactNode;
}

function normalize(h: HeaderProps): HeaderItemProps {
  return typeof h === "string" ? { fieldKey: h, label: h } : h;
}

function SortIcon({ state }: { state: SortIndicatorType | undefined }) {
  if (state === "asc") return <ChevronUp aria-hidden className="size-4 text-[var(--data-table-icon-strong)]" />;
  if (state === "desc") return <ChevronDown aria-hidden className="size-4 text-[var(--data-table-icon-strong)]" />;
  return <ChevronsUpDown aria-hidden className="size-4 text-[var(--data-table-icon-subtle)]" />;
}

function RowCheckbox({
  checked,
  indeterminate,
  disabled,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <Checkbox.Root
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onCheckedChange={(v) => onCheckedChange(Boolean(v))}
      aria-label={ariaLabel}
      className={cn(
        "size-5 inline-flex items-center justify-center rounded border outline-none transition-colors",
        "border-[var(--data-table-checkbox-border)] bg-[var(--data-table-checkbox-bg)]",
        "data-[checked]:bg-[var(--data-table-checkbox-checked-bg)] data-[checked]:border-[var(--data-table-checkbox-checked-bg)]",
        "data-[indeterminate]:bg-[var(--data-table-checkbox-checked-bg)] data-[indeterminate]:border-[var(--data-table-checkbox-checked-bg)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--lifesg-border-focus)] focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      )}
    >
      <Checkbox.Indicator className="text-[var(--data-table-checkbox-tick)]">
        {indeterminate ? (
          <span className="block w-2.5 h-0.5 bg-current rounded" />
        ) : (
          <Check className="size-3.5" strokeWidth={3} />
        )}
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}

export function DataTable({
  id,
  headers,
  rows = [],
  className,
  selectedIds = [],
  disabledIds = [],
  enableMultiSelect = false,
  enableSelectAll = false,
  enableActionBar = false,
  actionBarContent,
  loadState = "success",
  sortIndicators,
  alternatingRows = false,
  onHeaderClick,
  onSelect,
  onSelectAll,
  onClearSelectionClick,
  emptyView,
  renderCustomEmptyView,
}: DataTableProps) {
  const headerItems = headers.map(normalize);

  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectableRows = rows.filter((r) => !disabledIds.includes(String(r.id)));
  const allSelected = selectableRows.length > 0 && selectableRows.every((r) => selectedSet.has(String(r.id)));
  const someSelected = selectableRows.some((r) => selectedSet.has(String(r.id)));
  const isIndeterminate = someSelected && !allSelected;

  const showActionBar = enableActionBar && enableMultiSelect && someSelected;

  return (
    <div
      id={id}
      data-slot="data-table"
      className={cn(
        "border border-[var(--data-table-border)] rounded-[var(--data-table-radius)] overflow-hidden",
        className
      )}
    >
      {showActionBar && (
        <div className="flex items-center justify-between gap-3 px-[var(--data-table-cell-x)] py-3 bg-[var(--data-table-action-bar-bg)] border-b border-[var(--data-table-border)]">
          <div className="text-sm font-semibold text-[var(--lifesg-text)]">
            {selectedSet.size} selected
          </div>
          <div className="flex items-center gap-3">
            {actionBarContent}
            {onClearSelectionClick && (
              <button
                type="button"
                onClick={onClearSelectionClick}
                className="text-sm font-semibold text-[var(--lifesg-text-primary)] hover:underline cursor-pointer"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-base">
          <thead className="bg-[var(--data-table-head-bg)]">
            <tr>
              {enableMultiSelect && (
                <th
                  scope="col"
                  className="w-12 px-[var(--data-table-cell-x)] first:pl-[var(--data-table-cell-x-first)] py-[var(--data-table-head-y)] text-left"
                >
                  {enableSelectAll && (
                    <RowCheckbox
                      checked={allSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={() => onSelectAll?.(!allSelected)}
                      ariaLabel={allSelected ? "Deselect all rows" : "Select all rows"}
                    />
                  )}
                </th>
              )}
              {headerItems.map((h) => {
                const indicator = sortIndicators?.[h.fieldKey];
                const clickable = h.clickable;
                const inner = (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{h.label}</span>
                    {clickable && <SortIcon state={indicator} />}
                  </span>
                );
                return (
                  <th
                    key={h.fieldKey}
                    scope="col"
                    style={h.style}
                    className={cn(
                      "text-left font-bold px-[var(--data-table-cell-x)] first:pl-[var(--data-table-cell-x-first)] py-[var(--data-table-head-y)] text-[var(--lifesg-text)]",
                      clickable && "cursor-pointer select-none hover:bg-[var(--lifesg-bg-hover)]"
                    )}
                    onClick={clickable ? () => onHeaderClick?.(h.fieldKey) : undefined}
                    aria-sort={indicator === "asc" ? "ascending" : indicator === "desc" ? "descending" : undefined}
                  >
                    {inner}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loadState === "loading" && (
              <tr>
                <td colSpan={headerItems.length + (enableMultiSelect ? 1 : 0)} className="text-center py-12">
                  <span className="inline-flex items-center gap-2 text-sm text-[var(--lifesg-text-subtle)]">
                    <span className="inline-block size-4 rounded-full border-2 border-[var(--lifesg-border)] border-t-[var(--lifesg-border-primary)] animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            )}
            {loadState !== "loading" && rows.length === 0 && (
              <tr>
                <td colSpan={headerItems.length + (enableMultiSelect ? 1 : 0)} className="py-8">
                  {renderCustomEmptyView ? renderCustomEmptyView() : (emptyView ?? <ErrorDisplay type="no-item-found" />)}
                </td>
              </tr>
            )}
            {loadState !== "loading" && rows.map((row, i) => {
              const rowId = String(row.id);
              const isSelected = selectedSet.has(rowId);
              const isDisabled = disabledIds.includes(rowId);
              return (
                <tr
                  key={rowId}
                  className={cn(
                    "border-b border-[var(--data-table-row-border)] last:border-0 hover:bg-[var(--data-table-row-bg-hover)]",
                    isSelected && "bg-[var(--data-table-row-bg-selected)]",
                    alternatingRows && i % 2 === 1 && !isSelected && "bg-[var(--data-table-row-bg-alt)]"
                  )}
                >
                  {enableMultiSelect && (
                    <td className="px-[var(--data-table-cell-x)] first:pl-[var(--data-table-cell-x-first)] py-[var(--data-table-cell-y)]">
                      <RowCheckbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(next) => onSelect?.(rowId, next)}
                        ariaLabel={
                          (() => {
                            const keyCol = headerItems.find((h) => h.keyColumn);
                            const keyVal = keyCol ? row[keyCol.fieldKey] : null;
                            return typeof keyVal === "string" || typeof keyVal === "number"
                              ? `Select row: ${keyVal}`
                              : `Select row ${rowId}`;
                          })()
                        }
                      />
                    </td>
                  )}
                  {headerItems.map((h) => {
                    const v = row[h.fieldKey];
                    const cellContent =
                      typeof v === "function"
                        ? v(row, { isSelected })
                        : (v as React.ReactNode);
                    return (
                      <td
                        key={h.fieldKey}
                        className="px-[var(--data-table-cell-x)] first:pl-[var(--data-table-cell-x-first)] py-[var(--data-table-cell-y)] align-top"
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
