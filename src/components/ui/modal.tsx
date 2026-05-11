"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalAnimationDirection = "top" | "bottom" | "left" | "right";

export interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  animationFrom?: ModalAnimationDirection;
  enableOverlayClick?: boolean;
  zIndex?: number;
  onOverlayClick?: () => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

function animClass(dir: ModalAnimationDirection) {
  switch (dir) {
    case "top":
      return "data-[starting-style]:-translate-y-4 data-[ending-style]:-translate-y-4";
    case "left":
      return "data-[starting-style]:-translate-x-4 data-[ending-style]:-translate-x-4";
    case "right":
      return "data-[starting-style]:translate-x-4 data-[ending-style]:translate-x-4";
    case "bottom":
    default:
      return "data-[starting-style]:translate-y-4 data-[ending-style]:translate-y-4";
  }
}

function ModalRoot({
  show,
  children,
  animationFrom = "bottom",
  enableOverlayClick = true,
  zIndex,
  onOverlayClick,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: ModalProps) {
  return (
    <Dialog.Root
      open={show}
      modal
      disablePointerDismissal={!enableOverlayClick}
      onOpenChange={(next) => {
        if (!next) onOverlayClick?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          onClick={enableOverlayClick ? () => onOverlayClick?.() : undefined}
          className={cn(
            "fixed inset-0 bg-[var(--modal-backdrop)] transition-opacity duration-200",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            enableOverlayClick && "cursor-pointer"
          )}
          style={zIndex ? { zIndex } : undefined}
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
          style={zIndex ? { zIndex: zIndex + 1 } : undefined}
        >
          <Dialog.Popup
            className={cn(
              "pointer-events-auto outline-none transition-[opacity,transform] duration-200",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
              animClass(animationFrom)
            )}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          >
            {children}
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface ModalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function ModalBox({
  children,
  showCloseButton = false,
  onClose,
  className,
  ...props
}: ModalBoxProps) {
  return (
    <div
      data-slot="modal-box"
      className={cn(
        "relative bg-[var(--modal-box-bg)] text-[var(--lifesg-text)] rounded-[var(--modal-box-radius)] shadow-[var(--modal-box-shadow)] max-w-full max-h-[90vh] overflow-auto p-[var(--modal-box-padding)]",
        className
      )}
      {...props}
    >
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 size-9 inline-flex items-center justify-center rounded hover:bg-[var(--lifesg-bg-hover)] focus-visible:outline-2 focus-visible:outline-[var(--lifesg-border-focus)] cursor-pointer"
        >
          <X aria-hidden className="size-5 text-[var(--lifesg-icon)]" />
        </button>
      )}
      {children}
    </div>
  );
}

const Composite = Object.assign(ModalRoot, { Box: ModalBox });
export { Composite as Modal };
