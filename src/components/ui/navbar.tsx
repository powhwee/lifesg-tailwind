"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Masthead } from "@/components/ui/masthead";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";

export interface NavbarItem {
  id: string;
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavbarAction {
  id: string;
  label: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  onClick?: () => void;
  href?: string;
}

export interface NavbarBranding {
  brandName: string;
  logoSrc?: string;
  href?: string;
}

export interface NavbarProps {
  brand: NavbarBranding;
  items: NavbarItem[];
  selectedId?: string;
  actions?: NavbarAction[];
  masthead?: boolean;
  fixed?: boolean;
  className?: string;
}

function ActionButton({ action }: { action: NavbarAction }) {
  const v = action.variant ?? "default";
  if (action.href) {
    return (
      <a
        href={action.href}
        onClick={action.onClick}
        className={buttonVariants({ variant: v, size: "sm" })}
      >
        {action.label}
      </a>
    );
  }
  return (
    <Button variant={v} size="sm" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

function Navbar({
  brand,
  items,
  selectedId,
  actions = [],
  masthead,
  fixed,
  className,
}: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <div className={cn(fixed && "fixed top-0 left-0 right-0 z-40", "bg-[var(--navbar-bg)] border-b border-[var(--navbar-border)]", className)}>
      {masthead && <Masthead />}
      <div className="@container max-w-screen-xl mx-auto h-16 px-4 flex items-center gap-6">
        <a
          href={brand.href ?? "#"}
          aria-label={brand.brandName}
          className="flex items-center gap-3 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--lifesg-border-focus)] rounded"
        >
          {brand.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoSrc} alt={brand.brandName} className="h-9 w-auto" />
          ) : (
            <div aria-hidden="true" className="size-9 rounded-md bg-[var(--lifesg-bg-primary)]" />
          )}
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 flex-1 min-w-0">
          {items.map((item) => {
            const selected = item.id === selectedId;
            return (
              <a
                key={item.id}
                href={item.href ?? "#"}
                onClick={item.onClick}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center h-16 px-4 text-[var(--navbar-text)] hover:bg-[var(--navbar-bg-hover)] outline-none focus-visible:bg-[var(--navbar-bg-hover)]",
                  selected && "after:content-[''] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[var(--navbar-indicator)] font-semibold"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {actions.length > 0 && (
          <div className="hidden @4xl:flex items-center gap-2 shrink-0 ml-auto">
            {actions.map((a) => <ActionButton key={a.id} action={a} />)}
          </div>
        )}

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="md:hidden ml-auto size-10 inline-flex items-center justify-center rounded text-[var(--navbar-text)] hover:bg-[var(--navbar-bg-hover)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--lifesg-border-focus)]"
          >
            <Menu size={22} />
          </button>
          <DrawerContent side="right" className="md:hidden bg-[var(--navbar-bg)]">
            <DrawerHeader>
              <DrawerTitle className="font-semibold text-[var(--navbar-text)]">
                {brand.brandName}
              </DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <nav aria-label="Primary mobile" className="py-2">
                {items.map((item) => {
                  const selected = item.id === selectedId;
                  return (
                    <a
                      key={item.id}
                      href={item.href ?? "#"}
                      onClick={(e) => {
                        item.onClick?.(e);
                        setDrawerOpen(false);
                      }}
                      aria-current={selected ? "page" : undefined}
                      className={cn(
                        "block px-4 h-12 leading-[3rem] text-[var(--navbar-text)] hover:bg-[var(--navbar-bg-hover)]",
                        selected && "bg-[var(--lifesg-bg-selected)] font-semibold"
                      )}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </DrawerBody>
            {actions.length > 0 && (
              <DrawerFooter>
                {actions.map((a) => (
                  <ActionButton key={a.id} action={a} />
                ))}
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export { Navbar };
