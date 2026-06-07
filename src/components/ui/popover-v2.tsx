"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types — mirrors @lifesg/react-design-system/popover-v2
// ---------------------------------------------------------------------------

export type PopoverV2TriggerType = "click" | "hover";

export type PopoverV2Position =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-start"
  | "top-end"
  | "right-start"
  | "right-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end";

export type PopoverV2OverflowType =
  | "visible"
  | "hidden"
  | "clip"
  | "scroll"
  | "auto";

export interface PopoverV2RenderProps {
  overflow?: PopoverV2OverflowType;
  maxHeight?: number;
}

export interface PopoverV2RootProps {
  children: React.ReactNode;
  /** Aria label for screen readers; defaults to "More information". */
  ariaLabel?: string;
  className?: string;
  id?: string;
  maxHeight?: number;
  overflow?: PopoverV2OverflowType;
  "data-testid"?: string;
}

export interface PopoverV2TriggerProps {
  /** Element that toggles the popover (rendered as a trigger). */
  children: React.ReactNode;
  /** Popover body — string, JSX, or a render function. */
  popoverContent:
    | string
    | React.ReactNode
    | ((renderProps: PopoverV2RenderProps) => React.ReactNode);
  /** How the trigger opens. @default "click" */
  trigger?: PopoverV2TriggerType;
  /** Floating position. @default "top" */
  position?: PopoverV2Position;
  /** Hover delays in ms. */
  delay?: { open?: number; close?: number };
  /** Side-offset between trigger and popover. @default 16 */
  customOffset?: number;
  /** z-index override on the floating panel. */
  zIndex?: number;
  /** Aria label for the popover dialog. */
  popoverAriaLabel?: string;
  /** Disable flip placement when there isnt room. @default true */
  enableFlip?: boolean;
  className?: string;
  "data-testid"?: string;
  onPopoverAppear?: () => void;
  onPopoverDismiss?: () => void;
}

export type PopoverV2InlineStyle =
  | "default"
  | "underline"
  | "underline-dashed";

export interface PopoverV2InlineProps
  extends Omit<PopoverV2TriggerProps, "children"> {
  /** Trigger label rendered as inline text. */
  content?: React.ReactNode;
  /** Optional trailing icon; defaults to lucides Info. */
  icon?: React.ReactNode;
  /** Underline state at rest. @default "default" (no underline) */
  underlineStyle?: PopoverV2InlineStyle;
  /** Underline state on hover/focus. @default "default" */
  underlineHoverStyle?: PopoverV2InlineStyle;
  /** Aria label override for the trigger when content is empty. */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// PopoverV2 root box
// ---------------------------------------------------------------------------

function splitPosition(position: PopoverV2Position) {
  const [side, alignment] = position.split("-") as [string, string | undefined];
  return {
    side: side as "top" | "right" | "bottom" | "left",
    align:
      alignment === "start"
        ? ("start" as const)
        : alignment === "end"
          ? ("end" as const)
          : ("center" as const),
  };
}

function PopoverV2Root({
  children,
  ariaLabel = "More information",
  className,
  maxHeight,
  overflow,
  id,
  "data-testid": testId,
}: PopoverV2RootProps) {
  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      id={id}
      data-testid={testId ?? "popover"}
      className={cn(
        "max-w-popover-v2-max-w outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-popover-v2 border border-popover-v2-border bg-popover-v2-bg p-popover-v2-p text-popover-v2-text shadow-popover-v2",
        )}
        style={{
          maxHeight: maxHeight !== undefined ? `${maxHeight}px` : undefined,
          overflowY: overflow,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PopoverV2.Trigger — Base UI Popover wrapper
// ---------------------------------------------------------------------------

function PopoverV2Trigger({
  children,
  popoverContent,
  trigger = "click",
  position = "top",
  delay,
  customOffset = 16,
  zIndex,
  popoverAriaLabel,
  enableFlip = true,
  className,
  "data-testid": testId,
  onPopoverAppear,
  onPopoverDismiss,
}: PopoverV2TriggerProps) {
  const [open, setOpen] = React.useState(false);
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) onPopoverAppear?.();
    else onPopoverDismiss?.();
  };

  const cancelHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (trigger !== "hover") return;
    cancelHoverTimer();
    hoverTimer.current = setTimeout(
      () => handleOpenChange(true),
      delay?.open ?? 0,
    );
  };

  const handleMouseLeave = () => {
    if (trigger !== "hover") return;
    cancelHoverTimer();
    hoverTimer.current = setTimeout(
      () => handleOpenChange(false),
      delay?.close ?? 500,
    );
  };

  React.useEffect(() => () => cancelHoverTimer(), []);

  const { side, align } = splitPosition(position);

  const popoverBody =
    typeof popoverContent === "function"
      ? popoverContent({})
      : typeof popoverContent === "string"
        ? <PopoverV2Root ariaLabel={popoverAriaLabel}>{popoverContent}</PopoverV2Root>
        : popoverContent;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => handleOpenChange(Boolean(next))}
    >
      <PopoverPrimitive.Trigger
        render={(triggerProps) => (
          <span
            {...triggerProps}
            data-testid={testId}
            className={cn("inline cursor-pointer outline-none", className)}
            onMouseEnter={(e) => {
              triggerProps.onMouseEnter?.(e);
              handleMouseEnter();
            }}
            onMouseLeave={(e) => {
              triggerProps.onMouseLeave?.(e);
              handleMouseLeave();
            }}
            onClick={(e) => {
              if (trigger === "hover") {
                // For hover triggers, click is still allowed for touch users —
                // dont prevent default; just toggle open.
                e.stopPropagation();
                handleOpenChange(!open);
                return;
              }
              triggerProps.onClick?.(e);
            }}
          >
            {children}
          </span>
        )}
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          sideOffset={customOffset}
          side={side}
          align={align}
          style={{ zIndex }}
        >
          <PopoverPrimitive.Popup
            className="outline-none"
            onMouseEnter={cancelHoverTimer}
            onMouseLeave={handleMouseLeave}
            aria-label={popoverAriaLabel ?? "More information"}
          >
            {popoverBody}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// PopoverV2.Inline — link-styled trigger
// ---------------------------------------------------------------------------

const underlineClass = (style: PopoverV2InlineStyle): string => {
  switch (style) {
    case "underline":
      return "underline decoration-solid";
    case "underline-dashed":
      return "underline decoration-dashed";
    default:
      return "no-underline";
  }
};

function PopoverV2Inline({
  content,
  icon,
  underlineStyle = "default",
  underlineHoverStyle = "default",
  ariaLabel,
  popoverAriaLabel,
  className,
  ...triggerProps
}: PopoverV2InlineProps) {
  const hasContent = !!content;
  const trailingIcon = icon ?? (
    <Info className="size-4" aria-hidden="true" />
  );

  return (
    <PopoverV2Trigger
      {...triggerProps}
      popoverAriaLabel={popoverAriaLabel ?? ariaLabel}
      className={cn("inline-flex items-baseline gap-popover-inline-icon-gap", className)}
    >
      <span
        role="button"
        aria-label={ariaLabel ?? (hasContent ? undefined : "More info")}
        aria-haspopup="dialog"
        tabIndex={0}
        className={cn(
          "font-semibold text-popover-inline-text hover:text-popover-inline-text-hover focus-visible:text-popover-inline-text-hover focus-visible:outline-none",
          underlineClass(underlineStyle),
          `hover:${underlineClass(underlineHoverStyle)}`,
          `focus-visible:${underlineClass(underlineHoverStyle)}`,
        )}
      >
        {content}
        {trailingIcon && (
          <span className={cn("inline-block", hasContent && "ml-popover-inline-icon-gap")}>
            {trailingIcon}
          </span>
        )}
      </span>
    </PopoverV2Trigger>
  );
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const PopoverV2 = Object.assign(PopoverV2Root, {
  Trigger: PopoverV2Trigger,
  Inline: PopoverV2Inline,
});
