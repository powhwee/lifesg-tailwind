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
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Field>
  );
}

export { FormField };
