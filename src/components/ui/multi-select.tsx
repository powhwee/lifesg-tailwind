"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

interface OptionShape {
  value: string;
  label: string;
}

export interface MultiSelectProps<T = OptionShape> {
  options: T[];
  selectedOptions?: T[];
  onSelectOptions?: (options: T[]) => void;
  valueExtractor?: (item: T) => string;
  listExtractor?: (item: T) => string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
  maxSelectable?: number;
  /** Override the trigger summary. Receives count + comma-joined labels. */
  formatSummary?: (count: number, labels: string[]) => React.ReactNode;
}

function defaultValueExtractor<T>(item: T): string {
  return (item as unknown as OptionShape).value;
}
function defaultListExtractor<T>(item: T): string {
  return (item as unknown as OptionShape).label;
}

const triggerCx =
  "h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x text-left text-input flex items-center justify-between gap-2 hover:border-input-border-hover focus-visible:border-input-border-focus focus-visible:ring-3 focus-visible:ring-input-ring-focus focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:bg-input-bg-disabled data-[disabled]:border-input-border-disabled data-[disabled]:text-input-text-disabled";

const popupCx =
  "max-h-72 w-anchor-width min-w-[10rem] overflow-auto rounded-md border border-border bg-popover shadow-lg py-1";

const itemCx =
  "group flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none data-[highlighted]:bg-lifesg-bg-hover";

function MultiSelect<T = OptionShape>({
  options,
  selectedOptions = [],
  onSelectOptions,
  valueExtractor = defaultValueExtractor,
  listExtractor = defaultListExtractor,
  placeholder = "Select",
  disabled,
  readOnly,
  error,
  className,
  id,
  name,
  maxSelectable,
  formatSummary,
}: MultiSelectProps<T>) {
  const selectedValues = selectedOptions.map(valueExtractor);
  const lookup = React.useMemo(() => {
    const m = new Map<string, T>();
    for (const o of options) m.set(valueExtractor(o), o);
    return m;
  }, [options, valueExtractor]);

  const summary = (() => {
    if (selectedOptions.length === 0) return placeholder;
    const labels = selectedOptions.map(listExtractor);
    if (formatSummary) return formatSummary(selectedOptions.length, labels);
    return `${selectedOptions.length} selected`;
  })();

  return (
    <SelectPrimitive.Root
      multiple
      value={selectedValues}
      onValueChange={(values) => {
        if (!Array.isArray(values)) return;
        if (maxSelectable !== undefined && values.length > maxSelectable) return;
        const items = values
          .map((v) => lookup.get(v as string))
          .filter((x): x is T => !!x);
        onSelectOptions?.(items);
      }}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      id={id}
    >
      <SelectPrimitive.Trigger
        className={cn(
          triggerCx,
          error && "border-input-border-error ring-3 ring-input-ring-error",
          className
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOptions.length > 0
              ? "text-input-text"
              : "text-input-text-placeholder"
          )}
        >
          {summary}
        </span>
        <ChevronDown className="size-4 text-input-icon shrink-0" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={4} className="z-50">
          <SelectPrimitive.Popup className={popupCx}>
            {options.map((o) => {
              const v = valueExtractor(o);
              return (
                <SelectPrimitive.Item key={v} value={v} className={itemCx}>
                  <span className="grid size-4 shrink-0 place-items-center rounded-sm border border-lifesg-border group-data-[selected]:border-lifesg-bg-primary group-data-[selected]:bg-lifesg-bg-primary">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="size-3 text-lifesg-text-inverse" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>
                    {listExtractor(o)}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function FormMultiSelect<T = OptionShape>({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & MultiSelectProps<T>) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <MultiSelect {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { MultiSelect, FormMultiSelect };
