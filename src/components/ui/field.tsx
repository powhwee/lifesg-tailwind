"use client";

import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-field-label leading-field-label font-semibold text-field-text-label",
        "data-[disabled]:text-field-text-disabled",
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        "text-sm text-field-text-description",
        "data-[disabled]:text-field-text-disabled",
        className
      )}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  match,
  hideIcon,
  ...props
}: FieldPrimitive.Error.Props & { hideIcon?: boolean }) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      match={match ?? true}
      className={cn(
        "flex items-start gap-1.5 text-sm text-field-text-error",
        className
      )}
      {...props}
    >
      {!hideIcon ? <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> : null}
      <span>{children}</span>
    </FieldPrimitive.Error>
  );
}

const FieldControl = FieldPrimitive.Control;
const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  FieldValidity,
};
