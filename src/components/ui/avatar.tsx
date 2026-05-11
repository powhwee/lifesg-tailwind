import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-[var(--avatar-bg)] text-[var(--avatar-text)] select-none",
  {
    variants: {
      sizeType: {
        default: "size-[var(--avatar-size-default)] text-[var(--avatar-font-default)]",
        small:   "size-[var(--avatar-size-small)] text-[var(--avatar-font-small)]",
      },
    },
    defaultVariants: { sizeType: "default" },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  children?: React.ReactNode;
}

function Avatar({ className, sizeType = "default", children, ...props }: AvatarProps) {
  // Match LifeSG: string children render only the first character (single initial).
  // JSX elements (icons, <img>) pass through unchanged.
  const content = typeof children === "string" ? children.charAt(0) : children;
  return (
    <div data-slot="avatar" className={cn(avatarVariants({ sizeType }), className)} {...props}>
      {content}
    </div>
  );
}

export { Avatar, avatarVariants };
