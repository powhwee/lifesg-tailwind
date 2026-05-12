"use client";

import * as React from "react";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  id?: string;
  className?: string;
  value?: string[];
  numOfInput: number;
  prefix?: { value: string; separator: "-" };
  errorMessage?: React.ReactNode;
  cooldownDuration: number;
  actionButtonProps?: Omit<React.ComponentProps<typeof Button>, "children" | "onClick"> & {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  otpOnly?: boolean;
  onChange?: (value: string[]) => void;
  onCountdownChange?: (remaining: number) => void;
  onCooldownStart?: () => void;
  onCooldownEnd?: () => void;
}

function OtpInput({
  id,
  className,
  value,
  numOfInput,
  prefix,
  errorMessage,
  cooldownDuration,
  actionButtonProps,
  otpOnly,
  onChange,
  onCountdownChange,
  onCooldownStart,
  onCooldownEnd,
}: OtpInputProps) {
  const [internal, setInternal] = React.useState<string[]>(value ?? Array(numOfInput).fill(""));
  const [remaining, setRemaining] = React.useState(0);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const otpString = current.join("");
  const isError = !!errorMessage;

  const handleStringChange = (next: string) => {
    const padded = next.padEnd(numOfInput, "").slice(0, numOfInput).split("");
    while (padded.length < numOfInput) padded.push("");
    if (!isControlled) setInternal(padded);
    onChange?.(padded);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    actionButtonProps?.onClick?.(e);
    setRemaining(cooldownDuration);
    onCooldownStart?.();
  };

  React.useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        onCountdownChange?.(Math.max(next, 0));
        if (next <= 0) {
          clearInterval(timer);
          onCooldownEnd?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, onCountdownChange, onCooldownEnd]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <OTPField.Root
        id={id}
        length={numOfInput}
        value={otpString}
        onValueChange={handleStringChange}
        className="inline-flex items-center gap-2"
      >
        {prefix && (
          <>
            <span className="text-base font-semibold text-[var(--otp-prefix)]">{prefix.value}</span>
            <span aria-hidden="true" className="text-base text-[var(--otp-prefix)]">{prefix.separator}</span>
          </>
        )}
        {Array.from({ length: numOfInput }).map((_, i) => (
          <OTPField.Input
            key={i}
            aria-invalid={isError || undefined}
            className={cn(
              "size-14 rounded-lg border bg-[var(--otp-bg)] text-center text-lg font-semibold outline-none transition-colors",
              "border-[var(--otp-border)] text-[var(--otp-text)]",
              "focus:border-[var(--otp-border-focus)] focus:ring-3 focus:ring-[var(--otp-ring-focus)]",
              "aria-invalid:border-[var(--otp-border-error)] aria-invalid:ring-3 aria-invalid:ring-[var(--otp-ring-error)]"
            )}
          />
        ))}
      </OTPField.Root>

      {errorMessage && (
        <p className="text-sm text-[var(--otp-text-error)]">{errorMessage}</p>
      )}

      {!otpOnly && (
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full"
            {...actionButtonProps}
            onClick={handleClick}
            disabled={(actionButtonProps?.disabled ?? false) || remaining > 0}
          >
            {actionButtonProps?.children ?? "Verify"}
          </Button>
          {remaining > 0 && (
            <span className="text-sm text-[var(--lifesg-text-subtle)] text-center">Resend in {remaining}s</span>
          )}
        </div>
      )}
    </div>
  );
}

export { OtpInput };
