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

interface SelectBaseProps<T> {
  options: T[];
  valueExtractor?: (item: T) => string;
  listExtractor?: (item: T) => string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface SelectProps<T = OptionShape> extends SelectBaseProps<T> {
  selectedOption?: T | null;
  onSelectOption?: (option: T, value: string) => void;
}

function defaultValueExtractor<T>(item: T): string {
  return (item as unknown as OptionShape).value;
}
function defaultListExtractor<T>(item: T): string {
  return (item as unknown as OptionShape).label;
}

const triggerCx =
  "h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] px-[var(--input-padding-x)] text-left text-[length:var(--input-font-size)] leading-[var(--input-line-height)] flex items-center justify-between gap-2 hover:border-[var(--input-border-hover)] focus-visible:border-[var(--input-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--input-ring-focus)] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:bg-[var(--input-bg-disabled)] data-[disabled]:border-[var(--input-border-disabled)] data-[disabled]:text-[var(--input-text-disabled)]";

const popupCx =
  "max-h-72 w-[var(--anchor-width)] min-w-[10rem] overflow-auto rounded-md border border-border bg-popover shadow-lg py-1";

const itemCx =
  "flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer outline-none data-[highlighted]:bg-[var(--lifesg-bg-hover)] data-[selected]:bg-[var(--lifesg-bg-selected)] data-[selected]:text-[var(--lifesg-text-selected)]";

function Select<T = OptionShape>({
  options,
  selectedOption,
  onSelectOption,
  valueExtractor = defaultValueExtractor,
  listExtractor = defaultListExtractor,
  placeholder = "Select",
  disabled,
  readOnly,
  error,
  className,
  id,
  name,
}: SelectProps<T>) {
  const selected = selectedOption ? valueExtractor(selectedOption) : null;
  const lookup = React.useMemo(() => {
    const m = new Map<string, T>();
    for (const o of options) m.set(valueExtractor(o), o);
    return m;
  }, [options, valueExtractor]);

  return (
    <SelectPrimitive.Root
      value={selected}
      onValueChange={(v) => {
        if (typeof v !== "string") return;
        const item = lookup.get(v);
        if (item) onSelectOption?.(item, v);
      }}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      id={id}
    >
      <SelectPrimitive.Trigger
        className={cn(
          triggerCx,
          error && "border-[var(--input-border-error)] ring-3 ring-[var(--input-ring-error)]",
          className
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption
              ? "text-[var(--input-text)]"
              : "text-[var(--input-text-placeholder)]"
          )}
        >
          {selectedOption ? listExtractor(selectedOption) : placeholder}
        </span>
        <ChevronDown className="size-4 text-[var(--input-icon)] shrink-0" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={4} className="z-50">
          <SelectPrimitive.Popup className={popupCx}>
            {options.map((o) => {
              const v = valueExtractor(o);
              return (
                <SelectPrimitive.Item key={v} value={v} className={itemCx}>
                  <SelectPrimitive.ItemText>
                    {listExtractor(o)}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function FormSelect<T = OptionShape>({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & SelectProps<T>) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <Select {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { Select, FormSelect };
