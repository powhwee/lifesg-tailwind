"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Menu = MenuPrimitive.Root;
const MenuTrigger = MenuPrimitive.Trigger;
const MenuGroup = MenuPrimitive.Group;
const MenuRadioGroup = MenuPrimitive.RadioGroup;
const MenuSeparator = MenuPrimitive.Separator;
const MenuSubmenu = MenuPrimitive.SubmenuRoot;
const MenuSubmenuTrigger = MenuPrimitive.SubmenuTrigger;

const popupCx =
  "z-50 min-w-[10rem] rounded-[var(--popover-radius)] border border-[var(--popover-border)] bg-[var(--popover-bg)] shadow-[var(--popover-shadow)] outline-none py-1";

interface MenuContentProps
  extends React.ComponentProps<typeof MenuPrimitive.Popup> {
  sideOffset?: number;
  align?: MenuPrimitive.Positioner.Props["align"];
  side?: MenuPrimitive.Positioner.Props["side"];
  container?: React.ComponentProps<typeof MenuPrimitive.Portal>["container"];
}

function MenuContent({
  className,
  sideOffset = 4,
  align,
  side,
  container,
  children,
  ...popupProps
}: MenuContentProps) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner sideOffset={sideOffset} align={align} side={side}>
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(popupCx, className)}
          {...popupProps}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

const itemCx =
  "flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer outline-none data-[highlighted]:bg-[var(--lifesg-bg-hover)] data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(itemCx, className)}
      {...props}
    />
  );
}

function MenuLinkItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.LinkItem>) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="menu-link-item"
      className={cn(itemCx, className)}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(itemCx, className)}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className="grid size-4 place-items-center">
          <MenuPrimitive.CheckboxItemIndicator>
            <Check className="size-4" />
          </MenuPrimitive.CheckboxItemIndicator>
        </span>
        {children}
      </span>
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(itemCx, className)}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span className="grid size-4 place-items-center">
          <MenuPrimitive.RadioItemIndicator>
            <span className="size-2 rounded-full bg-[var(--lifesg-text)]" />
          </MenuPrimitive.RadioItemIndicator>
        </span>
        {children}
      </span>
    </MenuPrimitive.RadioItem>
  );
}

function MenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-group-label"
      className={cn("px-3 py-1.5 text-xs font-semibold text-[var(--lifesg-text-subtle)]", className)}
      {...props}
    />
  );
}

function MenuSeparatorStyled({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("my-1 h-px bg-[var(--lifesg-border)]", className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuSeparatorStyled as MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
};
