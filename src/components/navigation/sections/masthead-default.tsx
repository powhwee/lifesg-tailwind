"use client";

import { Masthead } from "@/components/ui/masthead";
import { Masthead as LifeSGMasthead } from "@lifesg/react-design-system/masthead";

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">default</code>
        <div className="mt-2 border border-border" data-token="default">
          <Masthead />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">stretch</code>
        <div className="mt-2 border border-border" data-token="stretch">
          <Masthead stretch />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">default</code>
        <div className="mt-2 border border-border" data-token="default">
          <LifeSGMasthead />
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">stretch</code>
        <div className="mt-2 border border-border" data-token="stretch">
          <LifeSGMasthead stretch />
        </div>
      </section>
    </div>
  );
}
