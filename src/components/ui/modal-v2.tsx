"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalV2AnimationDirection = "top" | "bottom" | "left" | "right";

export interface ModalV2Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  show: boolean;
  /**
   * The content of the modal — typically a single `<ModalV2.Card>`. LifeSG's
   * type requires a single React element child; we accept ReactNode for
   * ergonomics but the intended shape is one Card.
   */
  children: React.ReactNode;
  /** Slide-in direction. @default "bottom" */
  animationFrom?: ModalV2AnimationDirection;
  /** When false, clicks on the backdrop are ignored. @default true */
  enableOverlayClick?: boolean;
  zIndex?: number;
  /** Fires on any dismissal — Escape key, close-button click. */
  onClose?: () => void;
  /** Fires specifically when the backdrop is clicked (only if enableOverlayClick). */
  onOverlayClick?: () => void;
  /** Blur the active element when the modal opens (mobile keyboard dismissal). @default true */
  dismissKeyboardOnShow?: boolean;
  /** Skip auto-focusing the first focusable element inside the modal on open. @default false */
  disableInitialFocus?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

type CloseCtx = { onClose?: () => void };
const CloseContext = React.createContext<CloseCtx>({});

function animClass(dir: ModalV2AnimationDirection) {
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

function ModalV2Root({
  show,
  children,
  animationFrom = "bottom",
  enableOverlayClick = true,
  zIndex,
  onClose,
  onOverlayClick,
  dismissKeyboardOnShow = true,
  disableInitialFocus = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: ModalV2Props) {
  React.useEffect(() => {
    if (show && dismissKeyboardOnShow) {
      const el = document.activeElement as HTMLElement | null;
      el?.blur?.();
    }
  }, [show, dismissKeyboardOnShow]);

  return (
    <CloseContext.Provider value={{ onClose }}>
      <Dialog.Root
        open={show}
        modal
        // LifeSG v2 contract: backdrop click does NOT auto-dismiss; it only
        // fires onOverlayClick. The consumer decides whether to close. Escape
        // still dismisses (via Dialog) and fires onClose.
        disablePointerDismissal
        onOpenChange={(next) => {
          if (!next) onClose?.();
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop
            onClick={enableOverlayClick ? () => onOverlayClick?.() : undefined}
            className={cn(
              "fixed inset-0 bg-modal-v2-backdrop transition-opacity duration-200",
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
              initialFocus={disableInitialFocus ? false : undefined}
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
    </CloseContext.Provider>
  );
}

export interface ModalV2CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ModalV2Card = React.forwardRef<HTMLDivElement, ModalV2CardProps>(
  function ModalV2Card({ children, className, onClick, ...rest }, ref) {
    const list = React.Children.toArray(children);
    const find = (cmp: React.ComponentType<unknown>) =>
      list.find(
        (c): c is React.ReactElement =>
          React.isValidElement(c) && c.type === cmp
      );
    const close = find(ModalV2CloseButton as React.ComponentType<unknown>);
    const content = find(ModalV2Content as React.ComponentType<unknown>);
    const footer = find(ModalV2Footer as React.ComponentType<unknown>);
    const hasClose = Boolean(close);

    return (
      <div
        ref={ref}
        data-slot="modal-v2-card"
        // Stop clicks from propagating to the Backdrop (which fires onOverlayClick).
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        className={cn(
          "relative bg-modal-v2-card-bg text-lifesg-text rounded-modal-v2-card shadow-modal-v2-card",
          "w-modal-v2-card-width max-w-[calc(100vw-3rem)]",
          "flex flex-col",
          className
        )}
        {...rest}
      >
        {close}
        <div
          data-slot="modal-v2-spacer"
          data-has-close={String(hasClose)}
        >
          {content}
          {footer}
        </div>
      </div>
    );
  }
);

export interface ModalV2ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
function ModalV2Content({ className, children, ...rest }: ModalV2ContentProps) {
  return (
    <div
      data-slot="modal-v2-content"
      className={cn(
        "px-modal-v2-slot-x-mobile md:px-modal-v2-slot-x",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ModalV2FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}
function ModalV2Footer({
  className,
  primaryButton,
  secondaryButton,
  children,
  ...rest
}: ModalV2FooterProps) {
  return (
    <div
      data-slot="modal-v2-footer"
      className={cn(
        "px-modal-v2-slot-x-mobile md:px-modal-v2-slot-x",
        // Mobile: stacked, full-width buttons. Desktop: row-reverse so the
        // primary button (rendered first in source) appears on the right.
        "flex flex-col md:flex-row-reverse",
        "gap-y-modal-v2-footer-row-gap md:gap-x-modal-v2-footer-col-gap md:gap-y-0",
        "[&>button]:flex-1",
        className
      )}
      {...rest}
    >
      {primaryButton}
      {secondaryButton}
      {children}
    </div>
  );
}

export interface ModalV2CloseButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string;
}
function ModalV2CloseButton({
  className,
  "aria-label": ariaLabel = "Close button",
  ...rest
}: ModalV2CloseButtonProps) {
  const { onClose } = React.useContext(CloseContext);
  return (
    <div
      data-slot="modal-v2-close-button"
      className={cn(
        "m-modal-v2-close-margin ml-auto",
        className
      )}
      {...rest}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center rounded p-0 cursor-pointer",
          "text-lifesg-icon hover:bg-lifesg-bg-hover",
          "focus-visible:outline-2 focus-visible:outline-lifesg-border-focus"
        )}
      >
        <X aria-hidden className="size-8" />
      </button>
    </div>
  );
}

const Composite = Object.assign(ModalV2Root, {
  Card: ModalV2Card,
  Content: ModalV2Content,
  Footer: ModalV2Footer,
  CloseButton: ModalV2CloseButton,
});

export { Composite as ModalV2 };
