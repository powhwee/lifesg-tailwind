import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkAttrs = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  links: LinkAttrs[];
  separator?: "chevron" | "slash";
}

function Separator({ kind }: { kind: "chevron" | "slash" }) {
  if (kind === "slash") {
    return (
      <span aria-hidden="true" className="text-breadcrumb-separator select-none px-1">
        /
      </span>
    );
  }
  return (
    <ChevronRight
      aria-hidden="true"
      className="text-breadcrumb-separator shrink-0"
      size={14}
      strokeWidth={1.75}
    />
  );
}

function Breadcrumb({
  links,
  separator = "chevron",
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-breadcrumb-text text-base leading-6",
        className
      )}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none m-0 p-0">
        {links.map((link, i) => {
          const isLast = i === links.length - 1;
          const { className: linkClassName, children, ...rest } = link;
          return (
            <React.Fragment key={i}>
              <li className="inline-flex items-center min-w-0">
                <a
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "underline-offset-4 hover:underline truncate",
                    isLast
                      ? "text-breadcrumb-text-current pointer-events-none font-semibold"
                      : "text-breadcrumb-text",
                    linkClassName
                  )}
                  {...rest}
                >
                  {children}
                </a>
              </li>
              {!isLast && (
                <li aria-hidden="true" className="inline-flex items-center">
                  <Separator kind={separator} />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
