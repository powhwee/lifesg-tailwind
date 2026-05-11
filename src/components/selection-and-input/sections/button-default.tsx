"use client";

import { Button } from "@/components/ui/button";
import { Button as LifeSGButton } from "@lifesg/react-design-system/button";

export function OursPane() {
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">variants</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">variants</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <LifeSGButton.Default>Primary</LifeSGButton.Default>
          <LifeSGButton.Default styleType="secondary">Secondary</LifeSGButton.Default>
          <LifeSGButton.Default styleType="light">Ghost</LifeSGButton.Default>
          <LifeSGButton.Default styleType="link">Link</LifeSGButton.Default>
          <LifeSGButton.Default danger>Destructive</LifeSGButton.Default>
          <LifeSGButton.Default disabled>Disabled</LifeSGButton.Default>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <LifeSGButton.Small>Small</LifeSGButton.Small>
          <LifeSGButton.Default>Default</LifeSGButton.Default>
          <LifeSGButton.Large>Large</LifeSGButton.Large>
        </div>
      </section>
    </div>
  );
}
