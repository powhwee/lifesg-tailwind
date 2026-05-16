import * as React from "react";
import { cn } from "@/lib/utils";

export type UneditableSectionItemDisplayWidth = "half" | "full";

export interface UneditableSectionItem {
  id?: string;
  label: string;
  value: string | React.ReactNode;
  displayWidth?: UneditableSectionItemDisplayWidth;
  alert?: React.ReactNode;
}

export interface UneditableSectionProps extends React.HTMLAttributes<HTMLElement> {
  items?: UneditableSectionItem[];
  title?: string;
  description?: string;
  topSection?: React.ReactNode;
  bottomSection?: React.ReactNode;
  background?: boolean;
  stretch?: boolean;
  fullWidth?: boolean;
}

function Item({ item }: { item: UneditableSectionItem }) {
  return (
    <li
      className={cn(
        "flex flex-col gap-1",
        item.displayWidth === "half" ? "sm:col-span-1" : "sm:col-span-2"
      )}
    >
      <div className="text-xs font-semibold text-lifesg-text-subtle">
        {item.label}
      </div>
      <div className="text-sm text-lifesg-text">{item.value}</div>
      {item.alert && <div className="mt-1">{item.alert}</div>}
    </li>
  );
}

export function UneditableSection({
  items,
  title,
  description,
  topSection,
  bottomSection,
  background = true,
  stretch,
  fullWidth,
  className,
  children,
  ...props
}: UneditableSectionProps) {
  return (
    <section
      data-slot="uneditable-section"
      className={cn(
        "rounded-uneditable-section p-uneditable-section-padding",
        background
          ? "bg-uneditable-section-bg"
          : "bg-transparent",
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-lifesg-text">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-lifesg-text-subtle mt-1">{description}</p>
          )}
        </header>
      )}
      {topSection && <div className="mb-4">{topSection}</div>}
      {items && items.length > 0 && (
        <ul
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4",
            stretch ? "[&>li]:col-span-2" : ""
          )}
        >
          {items.map((item, i) => (
            <Item key={item.id ?? `${item.label}-${i}`} item={item} />
          ))}
        </ul>
      )}
      {children && <div className={items ? "mt-4" : ""}>{children}</div>}
      {bottomSection && <div className="mt-4">{bottomSection}</div>}
    </section>
  );
}
