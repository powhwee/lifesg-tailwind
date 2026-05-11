"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown, CircleAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type BoxContainerDisplayState = "default" | "error" | "warning";

export interface BoxContainerProps {
  children: React.ReactNode;
  title: React.ReactNode;
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  callToActionComponent?: React.ReactNode;
  displayState?: BoxContainerDisplayState;
  clickableHeader?: boolean;
  className?: string;
  id?: string;
}

function StateIcon({ state }: { state: BoxContainerDisplayState }) {
  if (state === "error") return <CircleAlert className="size-4 text-[var(--box-container-icon-error)]" aria-hidden />;
  if (state === "warning") return <TriangleAlert className="size-4 text-[var(--box-container-icon-warning)]" aria-hidden />;
  return null;
}

function stateClass(state: BoxContainerDisplayState) {
  if (state === "error")
    return "border-[var(--box-container-border-error)] bg-[var(--box-container-bg-error)]";
  if (state === "warning")
    return "border-[var(--box-container-border-warning)] bg-[var(--box-container-bg-warning)]";
  return "border-[var(--box-container-border)] bg-[var(--box-container-bg)]";
}

const panelCx =
  "data-[ending-style]:h-0 data-[starting-style]:h-0 h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200";

const bodyCx = "border-t border-[var(--box-container-border)] px-[var(--box-container-padding-x)] py-[var(--box-container-body-y)]";

export function BoxContainer({
  children,
  title,
  collapsible = false,
  expanded,
  defaultExpanded = true,
  onExpandedChange,
  callToActionComponent,
  displayState = "default",
  clickableHeader = true,
  className,
  id,
}: BoxContainerProps) {
  const rootClass = cn(
    "border rounded-[var(--box-container-radius)] overflow-hidden",
    stateClass(displayState),
    className
  );

  if (!collapsible) {
    return (
      <section id={id} data-slot="box-container" className={rootClass}>
        <div className="flex items-center gap-3 px-[var(--box-container-padding-x)] py-[var(--box-container-header-y)]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <StateIcon state={displayState} />
            <div className="text-base font-semibold text-[var(--lifesg-text)] truncate">{title}</div>
          </div>
          {callToActionComponent && <div className="flex items-center">{callToActionComponent}</div>}
        </div>
        <div className={bodyCx}>{children}</div>
      </section>
    );
  }

  return (
    <Collapsible.Root
      defaultOpen={expanded ?? defaultExpanded}
      open={expanded}
      onOpenChange={onExpandedChange}
      render={<section id={id} data-slot="box-container" className={rootClass} />}
    >
      {clickableHeader ? (
        <Collapsible.Trigger
          render={
            <button
              type="button"
              className="group/trigger w-full flex items-center gap-3 px-[var(--box-container-padding-x)] py-[var(--box-container-header-y)] text-left cursor-pointer hover:bg-[var(--lifesg-bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--lifesg-border-focus)]"
            />
          }
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <StateIcon state={displayState} />
            <div className="text-base font-semibold text-[var(--lifesg-text)] truncate">{title}</div>
          </div>
          <div className="flex items-center gap-3">
            {callToActionComponent && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {callToActionComponent}
              </span>
            )}
            <ChevronDown
              aria-hidden
              className="size-5 text-[var(--lifesg-icon)] transition-transform group-aria-expanded/trigger:rotate-180"
            />
          </div>
        </Collapsible.Trigger>
      ) : (
        <div className="flex items-center gap-3 px-[var(--box-container-padding-x)] py-[var(--box-container-header-y)]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <StateIcon state={displayState} />
            <div className="text-base font-semibold text-[var(--lifesg-text)] truncate">{title}</div>
          </div>
          <div className="flex items-center gap-3">
            {callToActionComponent}
            <Collapsible.Trigger
              render={
                <button
                  type="button"
                  aria-label="Toggle"
                  className="group/trigger size-8 inline-flex items-center justify-center rounded hover:bg-[var(--lifesg-bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--lifesg-border-focus)] cursor-pointer"
                />
              }
            >
              <ChevronDown
                aria-hidden
                className="size-5 text-[var(--lifesg-icon)] transition-transform group-aria-expanded/trigger:rotate-180"
              />
            </Collapsible.Trigger>
          </div>
        </div>
      )}
      <Collapsible.Panel keepMounted className={panelCx}>
        <div className={bodyCx}>{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
