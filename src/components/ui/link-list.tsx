"use client";

import * as React from "react";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type AnchorAttrs = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface LinkListItem extends AnchorAttrs {
  title: string;
  description?: string;
  secondaryDescription?: React.ReactNode;
}

export interface LinkListProps {
  items: LinkListItem[];
  style?: "default" | "small";
  maxShown?: number;
  customLabels?: { viewMore?: string; viewLess?: string };
  onItemClick?: (item: LinkListItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

function LinkListItemView({
  item,
  size,
  onItemClick,
}: {
  item: LinkListItem;
  size: "default" | "small";
  onItemClick?: (item: LinkListItem, e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { title, description, secondaryDescription, onClick, className, ...rest } = item;
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    onItemClick?.(item, e);
  };
  return (
    <li>
      <a
        {...rest}
        onClick={handle}
        className={cn(
          "group flex items-start gap-4 py-4 border-b border-link-list-border last:border-b-0",
          "outline-none focus-visible:bg-lifesg-bg-hover",
          className
        )}
      >
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-link-list-link underline-offset-4 group-hover:underline font-semibold",
              size === "default" ? "text-link-list-title-default" : "text-link-list-title-small"
            )}
          >
            {title}
          </div>
          {description && (
            <div
              className={cn(
                "mt-1 text-lifesg-text",
                size === "default" ? "text-link-list-desc-default" : "text-link-list-desc-small"
              )}
            >
              {description}
            </div>
          )}
          {secondaryDescription && (
            <div className="mt-1 text-sm text-lifesg-text-subtle">
              {secondaryDescription}
            </div>
          )}
        </div>
        <ChevronRight
          aria-hidden="true"
          size={20}
          className="shrink-0 mt-1 text-link-list-link"
        />
      </a>
    </li>
  );
}

function LinkList({
  items,
  style = "default",
  maxShown,
  customLabels,
  onItemClick,
  className,
}: LinkListProps) {
  const [expanded, setExpanded] = React.useState(false);
  const canCollapse = typeof maxShown === "number" && maxShown < items.length;
  const visible = !canCollapse || expanded ? items : items.slice(0, maxShown);
  const hiddenCount = items.length - (maxShown ?? items.length);
  return (
    <div className={cn("text-lifesg-text", className)}>
      <ul className="list-none m-0 p-0">
        {visible.map((item, i) => (
          <LinkListItemView key={i} item={item} size={style} onItemClick={onItemClick} />
        ))}
      </ul>
      {canCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-4 border-t border-link-list-border text-link-list-link font-semibold hover:underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-lifesg-border-focus"
        >
          {expanded
            ? (customLabels?.viewLess ?? "View less")
            : (customLabels?.viewMore ?? "View more")}
          {expanded ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      )}
    </div>
  );
}

export { LinkList };
