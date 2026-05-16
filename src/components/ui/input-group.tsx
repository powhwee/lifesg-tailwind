import * as React from "react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

const groupCx =
  "flex w-full overflow-hidden rounded-input border border-input-border bg-input-bg transition-colors hover:border-input-border-hover focus-within:border-input-border-focus focus-within:ring-3 focus-within:ring-input-ring-focus data-[error=true]:border-input-border-error data-[error=true]:ring-3 data-[error=true]:ring-input-ring-error data-[disabled=true]:bg-input-bg-disabled data-[disabled=true]:border-input-border-disabled data-[disabled=true]:cursor-not-allowed";

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
  "flex shrink-0 items-center px-3 text-input-group-addon-text text-input leading-input";

function InputGroupAddon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="input-group-addon" className={cn(addonCx, className)} {...props} />
  );
}

const groupInputCx =
  "h-input-height w-full bg-transparent border-0 outline-none px-3 text-input leading-input text-input-text placeholder:text-input-text-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled";

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
