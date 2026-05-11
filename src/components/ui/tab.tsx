"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

export interface TabItemProps {
  title: string;
  children: React.ReactNode;
  width?: string;
  className?: string;
  id?: string;
}

function TabItem(_props: TabItemProps): React.ReactElement | null {
  return null;
}
TabItem.displayName = "Tab.Item";

export interface TabProps {
  children: React.ReactNode;
  currentActive?: number;
  initialActive?: number;
  onTabClick?: (title: string, index: number) => void;
  fullWidthIndicatorLine?: boolean;
  className?: string;
  id?: string;
}

function isTabItem(node: React.ReactNode): node is React.ReactElement<TabItemProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { displayName?: string }).displayName === "Tab.Item"
  );
}

function TabRoot({
  children,
  currentActive,
  initialActive = 0,
  onTabClick,
  fullWidthIndicatorLine = false,
  className,
  id,
}: TabProps) {
  const items = React.Children.toArray(children).filter(isTabItem);

  return (
    <Tabs.Root
      id={id}
      value={currentActive}
      defaultValue={initialActive}
      onValueChange={(value) => {
        if (typeof value !== "number") return;
        const item = items[value];
        if (item) onTabClick?.(item.props.title, value);
      }}
      className={cn("flex flex-col", className)}
    >
      <div
        className={cn(
          "relative",
          fullWidthIndicatorLine && "border-b border-[var(--tab-track-color)]"
        )}
      >
        <Tabs.List activateOnFocus className="flex relative overflow-x-auto -mb-px">
          {items.map((item, i) => (
            <Tabs.Tab
              key={item.props.id ?? `${item.props.title}-${i}`}
              value={i}
              className={cn(
                "shrink-0 px-[var(--tab-x)] py-[var(--tab-y)] text-base font-semibold whitespace-nowrap outline-none cursor-pointer text-[var(--tab-text)] hover:text-[var(--tab-text-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--lifesg-border-focus)] aria-selected:text-[var(--tab-text-selected)] border-b-2 border-transparent aria-selected:border-[var(--tab-indicator-color)]"
              )}
              style={item.props.width ? { width: item.props.width } : undefined}
            >
              {item.props.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </div>

      {items.map((item, i) => (
        <Tabs.Panel
          key={item.props.id ?? `${item.props.title}-${i}-panel`}
          value={i}
          className={cn("pt-[var(--tab-panel-pt)] outline-none", item.props.className)}
        >
          {item.props.children}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

const Composite = Object.assign(TabRoot, { Item: TabItem });
export { Composite as Tab };
