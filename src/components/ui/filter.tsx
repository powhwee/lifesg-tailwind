"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FilterRootProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
  clearButtonDisabled?: boolean;
  onClear?: () => void;
  customLabels?: { headerTitle?: string; clearButtonLabel?: string };
  /** Deprecated; use customLabels.headerTitle */
  headerTitle?: string;
}

function FilterRoot({
  id,
  className,
  children,
  clearButtonDisabled,
  onClear,
  customLabels,
  headerTitle,
}: FilterRootProps) {
  const title = customLabels?.headerTitle ?? headerTitle ?? "Filters";
  const clearLabel = customLabels?.clearButtonLabel ?? "Clear";
  return (
    <aside
      id={id}
      data-slot="filter"
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-md border border-filter-border bg-filter-bg",
        className
      )}
    >
      <header className="flex items-center justify-between border-b border-filter-border px-4 py-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={clearButtonDisabled}
          className={cn(
            "text-sm font-semibold cursor-pointer text-filter-text-link",
            "hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline outline-none"
          )}
        >
          {clearLabel}
        </button>
      </header>
      <Accordion.Root multiple className="flex flex-col">
        {children}
      </Accordion.Root>
    </aside>
  );
}

interface FilterItemProps {
  title: string;
  children?: React.ReactNode;
  collapsible?: boolean;
  initialExpanded?: boolean;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  showDivider?: boolean;
  className?: string;
}

function FilterItem({
  title,
  children,
  collapsible = true,
  initialExpanded: _initialExpanded = true,
  expanded,
  onExpandChange,
  showDivider = true,
  className,
}: FilterItemProps) {
  // initialExpanded is accepted for API parity but not yet wired; Base UI
  // Accordion controls open-state at the Root via `value`/`defaultValue`.
  // Toggle via the trigger to expand. Add Root-level defaulting if a real
  // screen needs all-items-open-on-mount.
  void _initialExpanded;
  const value = title;
  return (
    <Accordion.Item
      value={value}
      data-slot="filter-item"
      className={cn(showDivider && "border-b border-filter-border last:border-b-0", className)}
      {...(expanded !== undefined ? { open: expanded, onOpenChange: onExpandChange } : { onOpenChange: onExpandChange })}
    >
      {collapsible ? (
        <Accordion.Header>
          <Accordion.Trigger className="group/filter-item flex w-full items-center justify-between gap-2 px-4 py-3 text-left cursor-pointer outline-none focus-visible:bg-filter-bg-hover">
            <span className="text-sm font-semibold">{title}</span>
            <ChevronDown className="size-4 transition-transform group-data-[panel-open]/filter-item:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
      ) : (
        <div className="px-4 py-3 text-sm font-semibold">{title}</div>
      )}
      <Accordion.Panel className="overflow-hidden data-[ending-style]:hidden">
        <div className="px-4 pb-3">{children}</div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export interface FilterCheckboxOption {
  value: string;
  label: string;
}

interface FilterCheckboxProps<T extends FilterCheckboxOption = FilterCheckboxOption> {
  title: string;
  options: T[];
  selectedOptions?: T[];
  onSelect?: (options: T[]) => void;
  labelExtractor?: (item: T) => React.ReactNode;
  valueExtractor?: (item: T) => string;
  collapsible?: boolean;
  initialExpanded?: boolean;
  showDivider?: boolean;
  /** Show "View more" / "View less" toggle when options exceed minimisedCount */
  minimisableOptions?: boolean;
  minimisedCount?: number;
}

function FilterCheckbox<T extends FilterCheckboxOption>({
  title,
  options,
  selectedOptions = [],
  onSelect,
  labelExtractor,
  valueExtractor,
  collapsible,
  initialExpanded,
  showDivider,
  minimisableOptions,
  minimisedCount = 5,
}: FilterCheckboxProps<T>) {
  const [showAll, setShowAll] = React.useState(false);
  const getValue = valueExtractor ?? ((item: T) => item.value);
  const getLabel = labelExtractor ?? ((item: T) => item.label);
  const selectedValues = new Set(selectedOptions.map(getValue));

  const visible =
    minimisableOptions && !showAll && options.length > minimisedCount
      ? options.slice(0, minimisedCount)
      : options;

  const toggle = (item: T) => {
    const v = getValue(item);
    const isSelected = selectedValues.has(v);
    const next = isSelected
      ? selectedOptions.filter((s) => getValue(s) !== v)
      : [...selectedOptions, item];
    onSelect?.(next);
  };

  return (
    <FilterItem title={title} collapsible={collapsible} initialExpanded={initialExpanded} showDivider={showDivider}>
      <div className="flex flex-col gap-2">
        {visible.map((item) => {
          const v = getValue(item);
          return (
            <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                displaySize="small"
                checked={selectedValues.has(v)}
                onCheckedChange={() => toggle(item)}
              />
              <span>{getLabel(item)}</span>
            </label>
          );
        })}
        {minimisableOptions && options.length > minimisedCount && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="self-start text-sm font-semibold text-filter-text-link hover:underline cursor-pointer outline-none"
          >
            {showAll ? "View less" : `View ${options.length - minimisedCount} more`}
          </button>
        )}
      </div>
    </FilterItem>
  );
}

const Filter = Object.assign(FilterRoot, {
  Item: FilterItem,
  Checkbox: FilterCheckbox,
});

export { Filter };
