"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItemType = "default" | "small";

export interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  type?: AccordionItemType;
  className?: string;
  id?: string;
}

function Item(_props: AccordionItemProps): React.ReactElement | null {
  return null;
}
Item.displayName = "Accordion.Item";

export interface AccordionProps {
  children: React.ReactNode;
  title?: string;
  enableExpandAll?: boolean;
  initialDisplay?: "expand-all" | "collapse-all";
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  showTitleInMobile?: boolean;
  onExpandCollapseChange?: (expanded: boolean) => void;
  className?: string;
  id?: string;
}

function isAccordionItem(node: React.ReactNode): node is React.ReactElement<AccordionItemProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { displayName?: string }).displayName === "Accordion.Item"
  );
}

function AccordionRoot({
  children,
  title,
  enableExpandAll = false,
  initialDisplay,
  headingLevel = 3,
  onExpandCollapseChange,
  className,
  id,
}: AccordionProps) {
  const items = React.Children.toArray(children).filter(isAccordionItem);
  const allIndices = React.useMemo(() => items.map((_, i) => i), [items]);

  const initial = React.useMemo<number[]>(() => {
    if (initialDisplay === "expand-all") return allIndices;
    if (initialDisplay === "collapse-all") return [];
    const flagged = items
      .map((item, i) => (item.props.defaultExpanded ? i : -1))
      .filter((i) => i >= 0);
    if (flagged.length > 0) return flagged;
    // LifeSG parity: items default to expanded when no explicit state given.
    return allIndices;
  }, [initialDisplay, items, allIndices]);

  const [value, setValue] = React.useState<number[]>(initial);
  const allExpanded = value.length === items.length && items.length > 0;

  const handleToggleAll = () => {
    const next = allExpanded ? [] : allIndices;
    setValue(next);
    onExpandCollapseChange?.(!allExpanded);
  };

  const Heading = `h${headingLevel}` as React.ElementType;

  return (
    <Accordion.Root
      id={id}
      multiple
      value={value}
      onValueChange={(next) => {
        if (!Array.isArray(next)) return;
        setValue(next as number[]);
      }}
      className={cn("flex flex-col rounded-accordion overflow-hidden border border-accordion-border", className)}
    >
      {(title || enableExpandAll) && (
        <div className="flex items-center justify-between gap-3 px-accordion-x py-3 border-b border-accordion-border bg-lifesg-bg">
          {title && (
            <div className="text-base font-semibold text-lifesg-text">{title}</div>
          )}
          {enableExpandAll && (
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-sm font-semibold text-lifesg-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lifesg-border-focus cursor-pointer"
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          )}
        </div>
      )}

      {items.map((item, i) => {
        const small = item.props.type === "small";
        return (
          <Accordion.Item
            key={item.props.id ?? `${typeof item.props.title === "string" ? item.props.title : i}-${i}`}
            value={i}
            className="border-b border-accordion-divider last:border-0"
          >
            <Accordion.Header
              render={<Heading className="m-0" />}
            >
              <Accordion.Trigger
                className={cn(
                  "group w-full flex items-center gap-3 px-accordion-x text-left cursor-pointer hover:bg-lifesg-bg-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lifesg-border-focus",
                  small ? "py-3 text-sm" : "py-4 text-lg",
                  "font-semibold text-lifesg-text"
                )}
              >
                <span className="flex-1 min-w-0">{item.props.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "shrink-0 size-5 text-lifesg-icon transition-transform group-aria-expanded:rotate-180"
                  )}
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel
              keepMounted
              // h-accordion-panel-height is a runtime CSS variable set by
              // @base-ui Accordion — not a design token, stays as arbitrary value.
              className="data-[ending-style]:h-0 data-[starting-style]:h-0 h-accordion-panel-height overflow-hidden transition-[height] duration-200"
            >
              <div className={cn("px-accordion-x", small ? "pb-3 text-sm" : "pb-4 text-sm")}>
                {item.props.children}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}

const Composite = Object.assign(AccordionRoot, { Item });
export { Composite as Accordion };
