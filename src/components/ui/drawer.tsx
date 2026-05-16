"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;

type DrawerSide = "left" | "right" | "top" | "bottom";

const sideCx: Record<DrawerSide, string> = {
  left:
    "left-0 top-0 h-full w-drawer-width-side max-w-full data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  right:
    "right-0 top-0 h-full w-drawer-width-side max-w-full data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
  top:
    "top-0 left-0 w-full h-drawer-height-side max-h-full data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
  bottom:
    "bottom-0 left-0 w-full h-drawer-height-side max-h-full data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
};

interface DrawerContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Popup> {
  /** @default "right" */
  side?: DrawerSide;
  /** Hide the X close button in the upper-right (or upper-left for side="left"). @default false */
  hideClose?: boolean;
  /** Custom backdrop className. */
  backdropClassName?: string;
  /** Override the portal container. */
  container?: React.ComponentProps<typeof DialogPrimitive.Portal>["container"];
}

function DrawerContent({
  className,
  side = "right",
  hideClose,
  backdropClassName,
  container,
  children,
  ...popupProps
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-drawer-overlay transition-opacity duration-200",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          backdropClassName
        )}
      />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          "fixed z-50 flex flex-col bg-drawer-bg shadow-drawer-shadow outline-none transition-transform duration-200 ease-out",
          sideCx[side],
          className
        )}
        {...popupProps}
      >
        {children}
        {!hideClose ? (
          <DialogPrimitive.Close
            aria-label="Close"
            className={cn(
              "absolute top-3 size-8 inline-flex items-center justify-center rounded hover:bg-lifesg-bg-hover outline-none focus-visible:ring-3 focus-visible:ring-lifesg-border-focus",
              side === "left" ? "right-3" : "right-3"
            )}
          >
            <X size={20} />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex items-center px-4 h-14 border-b border-lifesg-border shrink-0",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "border-t border-lifesg-border p-4 flex flex-col gap-2 shrink-0",
        className
      )}
      {...props}
    />
  );
}

function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
};
