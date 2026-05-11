"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Breadcrumb as LifeSGBreadcrumb } from "@lifesg/react-design-system/breadcrumb";

const sampleLinks = [
  { href: "#",  children: "Services" },
  { href: "#",  children: "Identity" },
  { href: "#",  children: "Update particulars" },
];

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground" data-token="chevron">chevron (default)</code>
        <div className="mt-2">
          <Breadcrumb links={sampleLinks} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="slash">slash</code>
        <div className="mt-2">
          <Breadcrumb links={sampleLinks} separator="slash" />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground" data-token="chevron">chevron (default)</code>
        <div className="mt-2">
          <LifeSGBreadcrumb links={sampleLinks} />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="slash">slash</code>
        <div className="mt-2">
          <LifeSGBreadcrumb links={sampleLinks} separatorStyle="slash" />
        </div>
      </section>
    </div>
  );
}
