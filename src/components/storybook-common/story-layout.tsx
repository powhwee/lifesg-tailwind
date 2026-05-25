import * as React from "react";
import { cn } from "@/lib/utils";

type Gap = 1 | 2 | 3 | 4 | 6 | 8;

const gapClass: Record<Gap, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

type StackProps = {
  children: React.ReactNode;
  gap?: Gap;
  className?: string;
};

export function Stack({ children, gap = 4, className }: StackProps) {
  return (
    <div className={cn("flex flex-col", gapClass[gap], className)}>
      {children}
    </div>
  );
}

type RowProps = {
  children: React.ReactNode;
  gap?: Gap;
  className?: string;
};

export function Row({ children, gap = 4, className }: RowProps) {
  return (
    <div className={cn("flex items-center", gapClass[gap], className)}>
      {children}
    </div>
  );
}

type LabeledControlProps = {
  control: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  gap?: Gap;
  className?: string;
  labelClassName?: string;
};

export function LabeledControl({
  control,
  htmlFor,
  children,
  gap = 3,
  className,
  labelClassName,
}: LabeledControlProps) {
  return (
    <div className={cn("flex items-center", gapClass[gap], className)}>
      {control}
      <label htmlFor={htmlFor} className={cn("text-sm", labelClassName)}>
        {children}
      </label>
    </div>
  );
}
