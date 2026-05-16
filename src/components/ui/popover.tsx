"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;
const PopoverArrow = PopoverPrimitive.Arrow;
const PopoverBackdrop = PopoverPrimitive.Backdrop;

const popupCx =
  "z-50 rounded-popover border border-popover-border bg-popover-bg shadow-popover-shadow outline-none";

interface PopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Popup> {
  /** Side offset from the trigger. @default 4 */
  sideOffset?: number;
  /** Side alignment. */
  align?: PopoverPrimitive.Positioner.Props["align"];
  /** Side anchor. */
  side?: PopoverPrimitive.Positioner.Props["side"];
  /** Optional Positioner className override. */
  positionerClassName?: string;
  /** Portal container; defaults to document.body. Pass a ref for the LifeSG `rootNode` equivalent. */
  container?: React.ComponentProps<typeof PopoverPrimitive.Portal>["container"];
  /** Explicit anchor element; defaults to the Popover.Trigger. */
  anchor?: PopoverPrimitive.Positioner.Props["anchor"];
}

function PopoverContent({
  className,
  positionerClassName,
  sideOffset = 4,
  align,
  side,
  container,
  anchor,
  children,
  ...popupProps
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner
        sideOffset={sideOffset}
        align={align}
        side={side}
        anchor={anchor}
        className={positionerClassName}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(popupCx, className)}
          {...popupProps}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
  PopoverBackdrop,
};
