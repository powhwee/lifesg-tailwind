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
        item.displayWidth === "half" ? "lifesg-xl:col-span-1" : "lifesg-xl:col-span-2"
      )}
    >
      <div className="text-base text-lifesg-text">{item.label}</div>
      <div className="text-base text-lifesg-text font-semibold">{item.value}</div>
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
        "rounded-uneditable-section py-uneditable-section-py px-uneditable-section-px",
        background
          ? "bg-uneditable-section-bg"
          : "bg-transparent",
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <header className="mb-6">
          {title && (
            <h3 className="text-typography-heading-sm leading-typography-heading-sm font-semibold text-lifesg-text">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-base text-lifesg-text mt-2">{description}</p>
          )}
        </header>
      )}
      {topSection && <div className="mb-6">{topSection}</div>}
      {items && items.length > 0 && (
        <ul
          className={cn(
            "grid grid-cols-1 lifesg-xl:grid-cols-2 gap-x-6 gap-y-8",
            stretch ? "[&>li]:col-span-2" : ""
          )}
        >
          {items.map((item, i) => (
            <Item key={item.id ?? `${item.label}-${i}`} item={item} />
          ))}
        </ul>
      )}
      {children && <div className={items ? "mt-6" : ""}>{children}</div>}
      {bottomSection && <div className="mt-6">{bottomSection}</div>}
    </section>
  );
}
