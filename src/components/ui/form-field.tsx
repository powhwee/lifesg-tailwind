"use client";

import * as React from "react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

export interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
  /**
   * When true, always reserve below-input space for the error message even
   * when no error is shown. Matches LifeSG's composite-input pattern (date
   * inputs, unit inputs) where the layout shouldn't shift when an error
   * appears. Defaults to false (collapse the slot when empty).
   */
  reserveErrorSlot?: boolean;
}

function FormField({
  label,
  description,
  errorMessage,
  disabled,
  id,
  name,
  className,
  children,
  reserveErrorSlot,
}: FormFieldProps) {
  return (
    <Field
      id={id}
      name={name}
      disabled={disabled}
      invalid={errorMessage ? true : undefined}
      className={className}
    >
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {children}
      {errorMessage ? (
        <FieldError>{errorMessage}</FieldError>
      ) : reserveErrorSlot ? (
        <div aria-hidden="true" className="min-h-5" />
      ) : null}
    </Field>
  );
}

export { FormField };
