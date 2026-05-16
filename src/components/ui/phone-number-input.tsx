"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

export interface PhoneNumberInputValue {
  countryCode?: string;
  number?: string;
}

interface CountryOption {
  iso2: string;
  name: string;
  countryCode: string;
}

const COUNTRIES: CountryOption[] = [
  { iso2: "SG", name: "Singapore",       countryCode: "+65"  },
  { iso2: "MY", name: "Malaysia",        countryCode: "+60"  },
  { iso2: "ID", name: "Indonesia",       countryCode: "+62"  },
  { iso2: "TH", name: "Thailand",        countryCode: "+66"  },
  { iso2: "VN", name: "Vietnam",         countryCode: "+84"  },
  { iso2: "PH", name: "Philippines",     countryCode: "+63"  },
  { iso2: "MM", name: "Myanmar",         countryCode: "+95"  },
  { iso2: "BN", name: "Brunei",          countryCode: "+673" },
  { iso2: "KH", name: "Cambodia",        countryCode: "+855" },
  { iso2: "LA", name: "Laos",            countryCode: "+856" },
  { iso2: "AU", name: "Australia",       countryCode: "+61"  },
  { iso2: "CN", name: "China",           countryCode: "+86"  },
  { iso2: "HK", name: "Hong Kong",       countryCode: "+852" },
  { iso2: "IN", name: "India",           countryCode: "+91"  },
  { iso2: "JP", name: "Japan",           countryCode: "+81"  },
  { iso2: "KR", name: "South Korea",     countryCode: "+82"  },
  { iso2: "NZ", name: "New Zealand",     countryCode: "+64"  },
  { iso2: "TW", name: "Taiwan",          countryCode: "+886" },
  { iso2: "GB", name: "United Kingdom",  countryCode: "+44"  },
  { iso2: "US", name: "United States",   countryCode: "+1"   },
];

function formatNumber(raw: string | undefined, countryCode: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (countryCode === "+65" && digits.length > 4) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }
  return digits;
}

interface PhoneNumberInputProps {
  value?: PhoneNumberInputValue;
  onChange?: (value: PhoneNumberInputValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  fixedCountry?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
  countries?: CountryOption[];
}

function PhoneNumberInput({
  value = { countryCode: "+65" },
  onChange,
  disabled,
  readOnly,
  error,
  fixedCountry,
  placeholder,
  className,
  countries = COUNTRIES,
  ...props
}: PhoneNumberInputProps) {
  const [open, setOpen] = React.useState(false);
  const country =
    countries.find((c) => c.countryCode === value.countryCode) ?? countries[0];

  return (
    <div
      className={cn(
        "flex items-stretch w-full rounded-input border border-input-border bg-input-bg hover:border-input-border-hover focus-within:border-input-border-focus focus-within:ring-3 focus-within:ring-input-ring-focus",
        error &&
          "border-input-border-error ring-3 ring-input-ring-error",
        disabled &&
          "bg-input-bg-disabled border-input-border-disabled cursor-not-allowed",
        className
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={(triggerProps) => (
            <button
              type="button"
              disabled={disabled || fixedCountry}
              aria-label={`Country code: ${country.name}`}
              {...triggerProps}
              className={cn(
                "flex items-center gap-1 px-3 text-input-text hover:bg-lifesg-bg-hover disabled:cursor-not-allowed disabled:bg-input-bg-disabled disabled:text-input-text-disabled",
                triggerProps.className
              )}
            >
              <span className="font-medium">{country.countryCode}</span>
              {!fixedCountry ? (
                <ChevronDown className="size-4 text-input-icon" />
              ) : null}
            </button>
          )}
        />
        <PopoverContent className="max-h-72 w-64 overflow-auto">
          <ul role="listbox" className="py-1">
            {countries.map((c) => (
              <li key={c.iso2}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.countryCode === country.countryCode}
                  onClick={() => {
                    onChange?.({ ...value, countryCode: c.countryCode });
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-lifesg-bg-hover",
                    c.countryCode === country.countryCode &&
                      "bg-lifesg-bg-selected text-lifesg-text-selected"
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.countryCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
      <input
        type="tel"
        inputMode="tel"
        value={formatNumber(value.number, country.countryCode)}
        onChange={(e) =>
          onChange?.({ ...value, number: e.target.value.replace(/\s+/g, "") })
        }
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete="tel"
        className="h-input-height flex-1 min-w-0 bg-transparent border-0 outline-none px-3 text-input leading-input text-input-text placeholder:text-input-text-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled"
        {...props}
      />
    </div>
  );
}

function FormPhoneNumberInput({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...rest
}: FormFieldProps & PhoneNumberInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <PhoneNumberInput {...rest} error={!!errorMessage || rest.error} />
    </FormField>
  );
}

export { PhoneNumberInput, FormPhoneNumberInput, COUNTRIES };
