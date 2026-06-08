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
        render={(triggerProps) => {
          // Merge triggerProps onto the consumer's single child element so
          // the aria-expanded / aria-haspopup attributes Base UI applies
          // land on an already-interactive element (their <Button>, a
          // native <button>, or — for PopoverV2.Inline — our own button).
          // Wrapping with another <button> would nest interactive
          // elements (axe `nested-interactive`); wrapping with a <span>
          // would put aria-expanded on a non-interactive carrier
          // (`aria-allowed-attr`).
          const child = React.Children.only(children) as React.ReactElement<
            React.HTMLAttributes<HTMLElement>
          >;
          return React.cloneElement(child, {
            ...triggerProps,
            "data-testid": testId,
            className: cn(child.props.className, className),
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
              triggerProps.onMouseEnter?.(e);
              child.props.onMouseEnter?.(e);
              handleMouseEnter();
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
              triggerProps.onMouseLeave?.(e);
              child.props.onMouseLeave?.(e);
              handleMouseLeave();
            },
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              if (trigger === "hover") {
                e.stopPropagation();
                handleOpenChange(!open);
                return;
              }
              triggerProps.onClick?.(e);
              child.props.onClick?.(e);
            },
          } as Record<string, unknown>);
        }}
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

  // PopoverV2Trigger clone-merges Base UIs trigger props onto our single
  // child, so the child must itself be the interactive trigger element.
  // We emit a native <button> so aria-expanded / aria-haspopup land on a
  // valid carrier without nesting interactive elements.
  return (
    <PopoverV2Trigger
      {...triggerProps}
      popoverAriaLabel={popoverAriaLabel ?? ariaLabel}
    >
      <button
        type="button"
        aria-label={ariaLabel ?? (hasContent ? undefined : "More info")}
        className={cn(
          "inline-flex items-baseline gap-popover-inline-icon-gap bg-transparent border-0 p-0 cursor-pointer outline-none",
          "font-semibold text-popover-inline-text hover:text-popover-inline-text-hover focus-visible:text-popover-inline-text-hover",
          underlineClass(underlineStyle),
          `hover:${underlineClass(underlineHoverStyle)}`,
          `focus-visible:${underlineClass(underlineHoverStyle)}`,
          className,
        )}
      >
        {content}
        {trailingIcon && (
          <span className={cn("inline-block", hasContent && "ml-popover-inline-icon-gap")}>
            {trailingIcon}
          </span>
        )}
      </button>
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
