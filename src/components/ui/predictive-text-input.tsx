"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

// ---------------------------------------------------------------------------
// Types — mirrors @lifesg/react-design-system/predictive-text-input
// ---------------------------------------------------------------------------

export type DropdownAlignment = "left" | "right";

export interface ListItemDisplayProps {
  title: string;
  secondaryLabel?: string;
}

export interface PredictiveTextInputProps<T, V>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  selectedOption?: T;
  /** Minimum characters before fetchOptions fires. @default 3 */
  minimumCharacters?: number;
  fetchOptions: (input: string) => Promise<T[]>;
  valueExtractor?: (item: T) => V;
  /** Display value for an item in the dropdown list. */
  listExtractor?: (item: T) => string | ListItemDisplayProps;
  /** Display value used for the input itself when an item is selected. */
  displayValueExtractor?: (item: T) => string;
  /** Fired when a list item is chosen. */
  onSelectOption?: (option: T | undefined, value: V | undefined) => void;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  alignment?: DropdownAlignment;
  dropdownZIndex?: number;
  dropdownWidth?: string;
  className?: string;
  "data-testid"?: string;
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
) {
  const fnRef = React.useRef(fn);
  React.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const trigger = React.useCallback(
    (...args: Args) => {
      cancel();
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [cancel, delay],
  );

  React.useEffect(() => cancel, [cancel]);

  return { trigger, cancel };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PredictiveTextInput<T, V>({
  selectedOption,
  minimumCharacters = 3,
  fetchOptions,
  valueExtractor,
  listExtractor,
  displayValueExtractor,
  onSelectOption,
  error,
  readOnly = false,
  disabled = false,
  alignment = "left",
  dropdownZIndex = 50,
  dropdownWidth,
  className,
  "data-testid": testId,
  placeholder = "Enter here…",
  ...inputProps
}: PredictiveTextInputProps<T, V>) {
  const getDisplay = React.useCallback(
    (item: T | undefined): string => {
      if (item === undefined) return "";
      if (displayValueExtractor) return displayValueExtractor(item);
      return String(item);
    },
    [displayValueExtractor],
  );

  const [input, setInput] = React.useState<string>(() => getDisplay(selectedOption));
  const [options, setOptions] = React.useState<T[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  const listboxId = React.useId();

  // Keep the input in sync if the caller swaps selectedOption.
  React.useEffect(() => {
    setInput(getDisplay(selectedOption));
  }, [selectedOption, getDisplay]);

  const runFetch = React.useCallback(
    async (value: string) => {
      setIsLoading(true);
      setIsError(false);
      try {
        const next = await fetchOptions(value);
        setOptions(next ?? []);
      } catch {
        setIsError(true);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOptions],
  );

  const { trigger: debouncedFetch, cancel: cancelFetch } = useDebouncedCallback(
    runFetch,
    250,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    setActiveIndex(-1);
    if (value.length >= minimumCharacters) {
      setIsOpen(true);
      debouncedFetch(value);
    } else {
      cancelFetch();
      setOptions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (item: T) => {
    setInput(getDisplay(item));
    setIsOpen(false);
    setOptions([]);
    setActiveIndex(-1);
    const value = valueExtractor ? valueExtractor(item) : undefined;
    onSelectOption?.(item, value);
  };

  const handleClear = () => {
    setInput("");
    setOptions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelectOption?.(undefined, undefined);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) {
      if (event.key === "ArrowDown" && input.length >= minimumCharacters && options.length === 0) {
        // Re-trigger fetch if user re-opens via keyboard.
        debouncedFetch(input);
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((idx) => (idx + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((idx) =>
          idx <= 0 ? options.length - 1 : idx - 1,
        );
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < options.length) {
          event.preventDefault();
          handleSelect(options[activeIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click.
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const renderItemContent = (item: T) => {
    const display = listExtractor ? listExtractor(item) : getDisplay(item);
    if (typeof display === "string") {
      return <span>{display}</span>;
    }
    return (
      <div className="flex flex-col">
        <span className="font-medium">{display.title}</span>
        {display.secondaryLabel && (
          <span className="text-sm text-predictive-text-input-item-text-meta">
            {display.secondaryLabel}
          </span>
        )}
      </div>
    );
  };

  const showDropdown =
    isOpen && (isLoading || isError || options.length > 0 || input.length >= minimumCharacters);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      data-testid={testId}
    >
      <Input
        {...inputProps}
        type="text"
        role="combobox"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => input.length >= minimumCharacters && setIsOpen(true)}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-invalid={error || undefined}
        allowClear
        onClear={handleClear}
      />

      {showDropdown && (
        <div
          style={{
            zIndex: dropdownZIndex,
            width: dropdownWidth,
            left: alignment === "left" ? 0 : undefined,
            right: alignment === "right" ? 0 : undefined,
          }}
          className={cn(
            "absolute top-full mt-2 max-h-predictive-text-input-dropdown-max-h overflow-y-auto",
            "rounded-predictive-text-input-dropdown border border-predictive-text-input-dropdown-border bg-predictive-text-input-dropdown-bg shadow-predictive-text-input-dropdown",
            !dropdownWidth && "min-w-full",
          )}
        >
          {isLoading && (
            <div className="flex items-center gap-2 px-predictive-text-input-item-px py-predictive-text-input-item-py text-sm text-predictive-text-input-item-text-meta">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Loading…</span>
            </div>
          )}
          {!isLoading && isError && (
            <div className="px-predictive-text-input-item-px py-predictive-text-input-item-py text-sm text-lifesg-text-error">
              Could not load suggestions.{" "}
              <button
                type="button"
                onClick={() => runFetch(input)}
                className="underline hover:text-lifesg-text-error"
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !isError && options.length === 0 && (
            <div className="px-predictive-text-input-item-px py-predictive-text-input-item-py text-sm text-predictive-text-input-item-text-meta">
              No results found.
            </div>
          )}
          {!isLoading && !isError && options.length > 0 && (
            <ul
              role="listbox"
              id={listboxId}
              className="list-none m-0 p-0"
            >
              {options.map((option, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={index}
                    role="option"
                    aria-selected={isActive}
                    id={`${listboxId}-option-${index}`}
                    className={cn(
                      "cursor-pointer min-h-predictive-text-input-item-min-h px-predictive-text-input-item-px py-predictive-text-input-item-py text-predictive-text-input-item-text",
                      isActive
                        ? "bg-predictive-text-input-item-bg-active"
                        : "hover:bg-predictive-text-input-item-bg-hover",
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                  >
                    {renderItemContent(option)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormPredictiveTextInput — wraps in FormField, parallels FormInput.
// LifeSGs Form namespace ships Form.PredictiveTextInput; we mirror that.
// ---------------------------------------------------------------------------

type FormPredictiveTextInputProps<T, V> = FormFieldProps &
  PredictiveTextInputProps<T, V>;

export function FormPredictiveTextInput<T, V>({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormPredictiveTextInputProps<T, V>) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <PredictiveTextInput<T, V> {...rest} disabled={disabled} />
    </FormField>
  );
}
