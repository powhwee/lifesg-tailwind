import * as React from "react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

const groupCx =
  "flex w-full overflow-hidden rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-bg)] transition-colors hover:border-[var(--input-border-hover)] focus-within:border-[var(--input-border-focus)] focus-within:ring-3 focus-within:ring-[var(--input-ring-focus)] data-[error=true]:border-[var(--input-border-error)] data-[error=true]:ring-3 data-[error=true]:ring-[var(--input-ring-error)] data-[disabled=true]:bg-[var(--input-bg-disabled)] data-[disabled=true]:border-[var(--input-border-disabled)] data-[disabled=true]:cursor-not-allowed";

function InputGroup({
  className,
  error,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { error?: boolean; disabled?: boolean }) {
  return (
    <div
      data-slot="input-group"
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      className={cn(groupCx, className)}
      {...props}
    />
  );
}

const addonCx =
  "flex shrink-0 items-center bg-[var(--input-group-addon-bg)] px-3 text-[var(--input-group-addon-text)] text-[length:var(--input-font-size)] leading-[var(--input-line-height)] [&:not(:last-child)]:border-r [&:not(:first-child)]:border-l border-[var(--input-group-addon-border)]";

function InputGroupAddon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="input-group-addon" className={cn(addonCx, className)} {...props} />
  );
}

const groupInputCx =
  "h-[var(--input-height)] w-full bg-transparent border-0 outline-none px-3 text-[length:var(--input-font-size)] leading-[var(--input-line-height)] text-[var(--input-text)] placeholder:text-[var(--input-text-placeholder)] disabled:cursor-not-allowed disabled:text-[var(--input-text-disabled)]";

function InputGroupInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(groupInputCx, className)}
      {...props}
    />
  );
}

function FormInputGroup({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  children,
  ...rest
}: FormFieldProps & React.HTMLAttributes<HTMLDivElement> & { error?: boolean }) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <InputGroup error={!!errorMessage || rest.error} disabled={disabled} {...rest}>
        {children}
      </InputGroup>
    </FormField>
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput, FormInputGroup };
