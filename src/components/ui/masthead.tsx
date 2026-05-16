"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MastheadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true the inner row spans the parent's full width rather than capping at the layout width. */
  stretch?: boolean;
}

function SGCrest({ className }: { className?: string }) {
  // Singapore state crest (lion). Path data extracted from sgds-masthead web component.
  return (
    <svg
      viewBox="0 0 20 20"
      width={20}
      height={20}
      fill="none"
      aria-hidden="true"
      className={cn("text-masthead-crest", className)}
    >
      <path d="M4.31179 7.0109C4.31179 7.0109 3.78527 7.78129 4.4749 8.77746C4.4749 8.77746 4.58365 8.27018 5.67275 8.27018H6.97989C8.21435 8.27018 9.13979 7.04881 8.55889 5.78895C8.55889 5.78895 9.42995 5.88317 9.72123 5.31901C10.0114 4.75544 9.70292 4.52966 9.26739 4.52966H7.07088C7.07088 4.9341 6.32687 4.9904 6.32687 4.52966H5.09241C5.09241 4.52966 4.16643 4.52966 4.14867 5.33797C4.14867 5.33797 4.35784 5.20641 4.56589 5.18803V5.40346C4.56589 5.40346 4.31179 5.45057 4.19361 5.51664C4.07599 5.58213 3.90344 5.7608 4.06711 6.22154C4.23023 6.68171 4.29403 6.84142 4.29403 6.84142C4.29403 6.84142 4.55757 6.60588 4.98422 6.60588H5.48356C6.37237 6.60588 6.20925 7.49864 5.31989 7.49864C4.43052 7.49864 4.3129 7.01032 4.3129 7.01032L4.31179 7.0109Z" fill="currentColor" />
      <path d="M8.94948 6.0808C8.94948 6.0808 9.24908 6.09976 9.46657 5.90271C9.46657 5.90271 11.4362 7.49118 8.51395 10.6859C5.59118 13.8813 7.85094 15.9494 7.85094 15.9494C7.85094 15.9494 7.32498 16.4751 7.62402 17.5C7.62402 17.5 6.40843 16.7894 5.47856 15.5823C4.13479 13.8382 3.31367 11.1697 7.00374 9.04116C7.00374 9.04116 9.43938 7.77268 8.94948 6.0808Z" fill="currentColor" />
      <path d="M5.93914 4.22922C5.93914 4.22922 6.33251 3.50249 7.24573 3.50249C7.96588 3.50249 8.13011 3.11988 8.13011 3.11988C8.13011 3.11988 8.44413 2.5 10.0298 2.5C11.4829 2.5 12.4621 3.00153 13.2544 3.67139C13.2544 3.67139 11.1183 2.2995 9.01282 4.22922H5.93914Z" fill="currentColor" />
      <path d="M14.8217 8.828C14.7612 6.5599 13.0668 4.12922 9.42448 4.2671C12.9825 1.14703 19.1543 8.11333 14.0711 11.7734C14.0711 11.7734 14.9216 10.517 14.8217 8.828Z" fill="currentColor" />
      <path d="M9.96927 4.51761C14.4106 4.37973 15.9962 9.89315 13.1278 12.3744L10.2478 13.8158C10.2478 13.8158 9.87273 12.5628 11.2648 11.0961C12.6568 9.6306 13.9994 6.88625 10.1518 5.08177C10.1518 5.08177 10.2245 4.70605 9.97038 4.51819L9.96927 4.51761Z" fill="currentColor" />
      <path d="M9.73904 5.75795C9.73904 5.75795 9.95708 5.54481 10.0298 5.36959C13.3331 6.79778 12.8133 9.21697 10.8403 11.2467C9.63029 12.537 10.0053 13.9284 10.0053 13.9284C10.0053 13.9284 8.52954 14.8803 8.02078 15.7076C8.02078 15.7076 5.88363 13.8233 8.84357 10.6957C11.748 7.62563 9.73904 5.75795 9.73904 5.75795Z" fill="currentColor" />
    </svg>
  );
}

function Masthead({ stretch, className, ...rest }: MastheadProps) {
  return (
    <Collapsible.Root>
      <div
        data-slot="masthead"
        className={cn(
          "w-full bg-masthead-bg text-masthead-text [font-size:var(--masthead-font-size)] [line-height:var(--masthead-line-height)]",
          className
        )}
        {...rest}
      >
        <div className={cn(stretch ? "w-full px-4" : "max-w-screen-xl mx-auto px-4")}>
          <div className="flex items-start gap-2 py-1.5">
            <SGCrest className="shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span>
                A Singapore Government Agency Website. Beware of government impersonation scams.
              </span>
              <Collapsible.Trigger
                render={(triggerProps, state) => (
                  <button
                    {...triggerProps}
                    className={cn(
                      "inline-flex items-center gap-1 self-start mt-0.5 underline-offset-4 hover:underline text-masthead-link outline-none focus-visible:underline",
                      triggerProps.className
                    )}
                  >
                    How to identify
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform", state.open && "rotate-180")}
                    />
                  </button>
                )}
              />
            </div>
          </div>
          <Collapsible.Panel className="overflow-hidden h-collapsible-panel-height transition-[height] duration-200">
            <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-[0.8125rem]">
              <div className="flex gap-2">
                <Globe size={18} className="shrink-0 mt-0.5 text-masthead-icon" />
                <div>
                  <p className="font-semibold mb-0.5">Official website links end with .gov.sg</p>
                  <p className="text-lifesg-text-subtle">
                    Government agencies communicate via .gov.sg websites
                    (e.g. <span className="underline">go.gov.sg/open</span>). Trusted websites.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Lock size={18} className="shrink-0 mt-0.5 text-masthead-icon" />
                <div>
                  <p className="font-semibold mb-0.5">Secure websites use HTTPS</p>
                  <p className="text-lifesg-text-subtle">
                    Look for a <span className="font-semibold">lock</span> (
                    <Lock size={12} className="inline align-baseline" />
                    ) or <span className="font-mono">https://</span> as an added precaution.
                    Share sensitive information only on official, secure websites.
                  </p>
                </div>
              </div>
            </div>
          </Collapsible.Panel>
        </div>
      </div>
    </Collapsible.Root>
  );
}

export { Masthead };
