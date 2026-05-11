"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocalNavItem {
  title: React.ReactNode;
  id?: string;
}

interface BaseProps {
  items: LocalNavItem[];
  selectedItemIndex?: number;
  onNavItemSelect: (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item: LocalNavItem,
    index: number
  ) => void;
  className?: string;
  id?: string;
}

interface MenuProps extends BaseProps {
  renderItem?: (item: LocalNavItem, render: { selected: boolean }) => React.ReactNode;
}

interface DropdownProps extends BaseProps {
  defaultLabel: React.ReactNode;
  stickyOffset?: number;
  renderItem?: (item: LocalNavItem, render: { selected: boolean; stickied: boolean }) => React.ReactNode;
}

function Menu({ items, selectedItemIndex, onNavItemSelect, renderItem, className, id }: MenuProps) {
  return (
    <nav
      id={id}
      aria-label="Local navigation"
      className={cn("w-full bg-[var(--local-nav-bg)]", className)}
    >
      <ul className="flex flex-col list-none m-0 p-0">
        {items.map((item, i) => {
          const selected = i === selectedItemIndex;
          return (
            <li key={item.id ?? i}>
              <button
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={(e) => onNavItemSelect(e, item, i)}
                className={cn(
                  "w-full text-left flex items-center pl-6 pr-4 py-3 text-[1.125rem] leading-snug text-[var(--local-nav-text)] hover:bg-[var(--local-nav-bg-hover)] outline-none focus-visible:bg-[var(--local-nav-bg-hover)] border-l-[3px] border-[var(--local-nav-rail)]",
                  selected && "border-[var(--local-nav-rail-selected)] font-semibold"
                )}
              >
                {renderItem ? renderItem(item, { selected }) : item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Dropdown({
  items,
  selectedItemIndex,
  onNavItemSelect,
  defaultLabel,
  stickyOffset = 0,
  renderItem,
  className,
  id,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [stickied, setStickied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        // when sticky top edge is no longer at original position, considered stickied
        setStickied(entry.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: `-${stickyOffset + 1}px 0px 0px 0px` }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stickyOffset]);

  // Match LifeSG: trigger always shows `defaultLabel`. The active item is reflected
  // in the open panel (aria-current + visual highlight) but not in the closed trigger.
  return (
    <div
      ref={ref}
      id={id}
      className={cn("sticky z-30 w-full bg-[var(--local-nav-bg)]", className)}
      style={{ top: stickyOffset }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 h-14 text-left text-[var(--local-nav-text)] font-semibold border border-[var(--local-nav-border)] rounded-md bg-[var(--local-nav-bg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--lifesg-border-focus)]",
          stickied && "shadow-sm"
        )}
      >
        <span>{defaultLabel}</span>
        <ChevronDown size={18} className={cn("transition-transform shrink-0", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="list-none m-0 px-0 py-1 mt-1 border border-[var(--local-nav-border)] rounded-md bg-[var(--local-nav-bg)] shadow-md">
          {items.map((item, i) => {
            const isSelected = i === selectedItemIndex;
            return (
              <li key={item.id ?? i}>
                <button
                  type="button"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={(e) => { onNavItemSelect(e, item, i); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 h-10 text-[var(--local-nav-text)] hover:bg-[var(--local-nav-bg-hover)] outline-none focus-visible:bg-[var(--local-nav-bg-hover)]",
                    isSelected && "bg-[var(--local-nav-bg-selected)] text-[var(--local-nav-text-selected)] font-semibold"
                  )}
                >
                  {renderItem ? renderItem(item, { selected: isSelected, stickied }) : item.title}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const LocalNav = { Menu, Dropdown };

export { LocalNav };
