"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, X, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface BaseItemProps {
  fileName?: string;
  fileSize?: string;
}
export interface FullscreenImageItemProps extends BaseItemProps {
  type?: "image";
  src: string;
  alt?: string;
  thumbnailSrc?: string;
  renderContent?: never;
}
export interface FullscreenCustomItemProps extends BaseItemProps {
  type: "custom";
  thumbnailSrc?: string;
  itemLabel?: string;
  renderContent: () => React.ReactNode;
}
export type FullscreenImageCarouselItemProps =
  | FullscreenImageItemProps
  | FullscreenCustomItemProps;

export interface FullscreenImageCarouselRef {
  currentItemIndex: number;
  setCurrentItem: (index: number) => void;
  goToPrevItem: () => void;
  goToNextItem: () => void;
}

export interface FullscreenImageCarouselProps {
  show: boolean;
  items: FullscreenImageCarouselItemProps[];
  initialActiveItemIndex?: number;
  hideThumbnail?: boolean;
  hideNavigation?: boolean;
  hideCounter?: boolean;
  hideMagnifier?: boolean;
  zIndex?: number;
  onDelete?: (item: FullscreenImageCarouselItemProps, index: number) => void;
  onClose?: () => void;
}

const IconBtn = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function IconBtn({ className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center size-10 rounded-full text-[var(--fic-icon)] bg-[var(--fic-button-bg)] hover:bg-[var(--fic-button-bg-hover)] outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-40 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const FullscreenImageCarousel = React.forwardRef<
  FullscreenImageCarouselRef,
  FullscreenImageCarouselProps
>(function FullscreenImageCarousel(
  {
    show,
    items,
    initialActiveItemIndex = 0,
    hideThumbnail = false,
    hideNavigation = false,
    hideCounter = false,
    hideMagnifier = false,
    zIndex,
    onDelete,
    onClose,
  },
  ref
) {
  const [index, setIndex] = React.useState(initialActiveItemIndex);
  const [zoomed, setZoomed] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      setIndex(initialActiveItemIndex);
      setZoomed(false);
    }
  }, [show, initialActiveItemIndex]);

  const goToPrev = React.useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length);
    setZoomed(false);
  }, [items.length]);
  const goToNext = React.useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
    setZoomed(false);
  }, [items.length]);

  React.useImperativeHandle(ref, () => ({
    currentItemIndex: index,
    setCurrentItem: (i) => { setIndex(i); setZoomed(false); },
    goToPrevItem: goToPrev,
    goToNextItem: goToNext,
  }), [index, goToNext, goToPrev]);

  // Keyboard nav: ArrowLeft / ArrowRight while shown.
  // Attached at document with capture so we run before any focused-element handler.
  React.useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [show, goToPrev, goToNext]);

  if (items.length === 0) return null;
  const active = items[index];
  const hasNav = !hideNavigation && items.length > 1;
  const isImage = !active.type || active.type === "image";
  const itemLabelText = active.type === "custom" ? active.itemLabel ?? "item" : "image";

  return (
    <Modal
      show={show}
      onOverlayClick={onClose}
      zIndex={zIndex}
      aria-label={`${itemLabelText} ${index + 1} of ${items.length}`}
    >
      <Modal.Box
        className="bg-transparent shadow-none p-0 w-screen h-screen max-w-none max-h-none rounded-none flex flex-col"
        style={{ background: "var(--fic-backdrop)" }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 text-[var(--fic-text)]">
          <div className="text-sm">
            {!hideCounter && (
              <span className="opacity-90">{index + 1} / {items.length}</span>
            )}
            {active.fileName && (
              <span className="ml-3 opacity-80">{active.fileName}{active.fileSize ? ` · ${active.fileSize}` : ""}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isImage && !hideMagnifier && (
              <IconBtn aria-label={zoomed ? "Zoom out" : "Zoom in"} onClick={() => setZoomed((z) => !z)}>
                {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
              </IconBtn>
            )}
            {onDelete && (
              <IconBtn aria-label="Delete item" onClick={() => onDelete(active, index)}>
                <Trash2 className="size-5" />
              </IconBtn>
            )}
            <IconBtn aria-label="Close" onClick={onClose}>
              <X className="size-5" />
            </IconBtn>
          </div>
        </div>

        {/* Stage */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 overflow-hidden">
          {hasNav && (
            <IconBtn
              aria-label="Previous item"
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronLeft className="size-6" />
            </IconBtn>
          )}

          <div className="w-full h-full flex items-center justify-center">
            {isImage ? (
              <img
                src={(active as FullscreenImageItemProps).src}
                alt={(active as FullscreenImageItemProps).alt ?? `Image ${index + 1}`}
                className={cn(
                  "max-w-full max-h-full object-contain select-none",
                  zoomed && "max-w-none max-h-none scale-150 origin-center cursor-zoom-out",
                  !zoomed && "cursor-zoom-in"
                )}
                onClick={() => !hideMagnifier && setZoomed((z) => !z)}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full max-w-5xl max-h-full overflow-auto">
                {(active as FullscreenCustomItemProps).renderContent()}
              </div>
            )}
          </div>

          {hasNav && (
            <IconBtn
              aria-label="Next item"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronRight className="size-6" />
            </IconBtn>
          )}
        </div>

        {/* Thumbnails */}
        {!hideThumbnail && items.length > 1 && (
          <div className="px-4 pb-4 pt-2">
            <div className="flex justify-center gap-2 overflow-x-auto">
              {items.map((it, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setIndex(i); setZoomed(false); }}
                  aria-label={`Go to item ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "shrink-0 size-16 rounded overflow-hidden border-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                    i === index
                      ? "border-[var(--fic-thumb-border-active)]"
                      : "border-[var(--fic-thumb-border)] opacity-70 hover:opacity-100"
                  )}
                >
                  {it.thumbnailSrc || (!it.type || it.type === "image") ? (
                    <img
                      src={it.thumbnailSrc ?? (it as FullscreenImageItemProps).src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 grid place-items-center text-xs text-white/90">
                      {(it as FullscreenCustomItemProps).itemLabel?.[0]?.toUpperCase() ?? "·"}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal.Box>
    </Modal>
  );
});
