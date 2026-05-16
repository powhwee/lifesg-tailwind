import * as React from "react";

import { cn } from "@/lib/utils";
import { FormField, type FormFieldProps } from "@/components/ui/form-field";

const textareaCx =
  "min-h-[6rem] w-full rounded-input border border-input-border bg-input-bg px-input-padding-x py-2 text-input leading-input text-input-text placeholder:text-input-text-placeholder outline-none transition-colors hover:border-input-border-hover focus-visible:border-input-border-focus focus-visible:ring-3 focus-visible:ring-input-ring-focus disabled:cursor-not-allowed disabled:bg-input-bg-disabled disabled:text-input-text-disabled disabled:border-input-border-disabled aria-invalid:border-input-border-error aria-invalid:ring-3 aria-invalid:ring-input-ring-error read-only:bg-input-bg-readonly resize-y";

interface TextareaOwnProps {
  showCounter?: boolean;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextareaOwnProps;

function Textarea({ className, showCounter, value, maxLength, ...props }: TextareaProps) {
  const len = typeof value === "string" ? value.length : 0;
  if (showCounter && maxLength) {
    return (
      <div className={cn("w-full", className)}>
        <textarea
          data-slot="textarea"
          value={value}
          maxLength={maxLength}
          className={textareaCx}
          {...props}
        />
        <div className="mt-1 text-right text-xs text-input-counter-text tabular-nums">
          {maxLength - len} characters left
        </div>
      </div>
    );
  }
  return (
    <textarea
      data-slot="textarea"
      value={value}
      maxLength={maxLength}
      className={cn(textareaCx, className)}
      {...props}
    />
  );
}

function FormTextarea({
  label,
  description,
  errorMessage,
  disabled,
  name,
  id,
  ...textareaProps
}: FormFieldProps & TextareaProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorMessage={errorMessage}
      disabled={disabled}
      name={name}
      id={id}
    >
      <Textarea {...textareaProps} />
    </FormField>
  );
}

export { Textarea, FormTextarea };
