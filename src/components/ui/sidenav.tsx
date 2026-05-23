"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerSubitemElement = React.ReactElement<SidenavDrawerSubitemProps>;
type DrawerItemElement = React.ReactElement<SidenavDrawerItemProps>;
type ItemElement = React.ReactElement<SidenavItemProps>;
type GroupElement = React.ReactElement<SidenavGroupProps>;

interface SidenavContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}
const SidenavContext = React.createContext<SidenavContextValue | null>(null);

export interface SidenavProps {
  children: React.ReactNode;
  fixed?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

function Sidenav({ children, fixed = true, className, id, "aria-label": ariaLabel }: SidenavProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  return (
    <SidenavContext.Provider value={{ openId, setOpenId }}>
      <div
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex text-sidenav-text",
          fixed ? "fixed left-0 top-0 bottom-0 z-30" : "h-full",
          className
        )}
      >
        {/* Icon rail — narrow column with right border */}
        <nav className="w-sidenav-rail-width pt-sidenav-rail-pt pb-sidenav-rail-pb flex flex-col items-stretch border-r border-sidenav-border bg-sidenav-bg">
          {children}
        </nav>
        <DrawerPanel>{children}</DrawerPanel>
      </div>
    </SidenavContext.Provider>
  );
}

export interface SidenavGroupProps {
  children: React.ReactNode;
  separator?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

function Group({ children, separator, className, id, "aria-label": ariaLabel }: SidenavGroupProps) {
  return (
    <div id={id} aria-label={ariaLabel} className={cn("flex flex-col gap-1", separator && "pb-3 mb-3 relative after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-0 after:h-px after:bg-sidenav-border", className)}>
      {children}
    </div>
  );
}

export interface SidenavItemProps {
  title: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: (id: string | undefined) => void;
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

function Item({ title, icon, selected, onClick, children, id, className }: SidenavItemProps) {
  const ctx = React.useContext(SidenavContext);
  const internalId = React.useId();
  const itemId = id ?? internalId;
  const hasChildren = React.Children.count(children) > 0;
  const isOpen = ctx?.openId === itemId;
  const drawerIsOpen = ctx?.openId !== null && ctx?.openId !== undefined;
  // When a drawer is open, only highlight the open item — suppress `selected`
  // on other items. Matches LifeSG behavior.
  const isActive = isOpen || (selected && !drawerIsOpen);
  const handle = () => {
    if (hasChildren) {
      ctx?.setOpenId(isOpen ? null : itemId);
    } else {
      onClick?.(id);
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={hasChildren ? isOpen : undefined}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "relative mx-2 inline-flex flex-col items-center justify-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-lifesg-border-focus",
        className
      )}
    >
      {/* Icon pill — selected/open highlight scoped to icon area */}
      <span
        aria-hidden="true"
        className={cn(
          "w-sidenav-pill-w h-sidenav-pill-h inline-flex items-center justify-center rounded-lg text-sidenav-icon hover:bg-sidenav-bg-hover",
          isActive && "bg-sidenav-bg-selected text-sidenav-icon-selected"
        )}
      >
        <span className="size-sidenav-icon-size [&_svg]:size-full">{icon}</span>
      </span>
      <span
        className={cn("text-sidenav-label leading-sidenav-label-line text-sidenav-text", isActive && "text-sidenav-icon-selected font-semibold")}
      >
        {title}
      </span>
    </button>
  );
}

function DrawerPanel({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SidenavContext);
  const open = ctx?.openId !== null && ctx?.openId !== undefined;
  // Find which item is open by walking children
  let activeItem: ItemElement | null = null;
  React.Children.forEach(children, (group) => {
    if (!React.isValidElement<SidenavGroupProps>(group)) return;
    React.Children.forEach((group.props as SidenavGroupProps).children, (item) => {
      if (!React.isValidElement(item)) return;
      const itemEl = item as ItemElement;
      if (!itemEl.props.id) return;
      if (itemEl.props.id === ctx?.openId) {
        activeItem = itemEl;
      }
    });
  });
  if (!open || !activeItem) return null;
  const ai = activeItem as ItemElement;
  return (
    <div className="w-72 border-l border-sidenav-border bg-sidenav-drawer-bg flex flex-col">
      <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
        {ai.props.children}
      </div>
    </div>
  );
}

export interface SidenavDrawerItemProps {
  title: string;
  onClick?: (id: string | undefined) => void;
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

function DrawerItem({ title, onClick, children, id, className }: SidenavDrawerItemProps) {
  const hasChildren = React.Children.count(children) > 0;
  const [open, setOpen] = React.useState(true);
  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => onClick?.(id)}
        className={cn(
          "text-left px-3 h-10 rounded text-sidenav-text hover:bg-sidenav-bg-hover outline-none focus-visible:bg-sidenav-bg-hover",
          className
        )}
      >
        {title}
      </button>
    );
  }
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 h-10 rounded text-left text-sidenav-text font-semibold hover:bg-sidenav-bg-hover outline-none focus-visible:bg-sidenav-bg-hover"
      >
        <span>{title}</span>
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-3 mt-0.5 flex flex-col gap-0.5">{children}</div>
      )}
    </div>
  );
}

export interface SidenavDrawerSubitemProps {
  title: string;
  onClick?: (id: string | undefined) => void;
  id?: string;
  className?: string;
}

function DrawerSubitem({ title, onClick, id, className }: SidenavDrawerSubitemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className={cn(
        "text-left px-3 h-9 rounded text-sm text-sidenav-text-subtle hover:bg-sidenav-bg-hover hover:text-sidenav-text outline-none focus-visible:bg-sidenav-bg-hover",
        className
      )}
    >
      {title}
    </button>
  );
}

const Composite = Object.assign(Sidenav, {
  Group,
  Item,
  DrawerItem,
  DrawerSubitem,
});

export { Composite as Sidenav };
