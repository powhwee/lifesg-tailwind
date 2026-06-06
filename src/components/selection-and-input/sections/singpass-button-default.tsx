"use client";

import { SingpassButton } from "@/components/ui/singpass-button";
import { SingpassButton as LifeSGSingpassButton } from "@lifesg/react-design-system/singpass-button";

export function OursPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="sni-singpass-button-ours">
      <section>
        <code className="text-xs text-muted-foreground">styles &mdash; default size</code>
        <div className="mt-3 flex flex-wrap items-center gap-4 p-4 bg-lifesg-bg-strong rounded">
          <SingpassButton.Default styleType="red-filled" />
          <SingpassButton.Default styleType="white-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes &mdash; red-filled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <SingpassButton.Small styleType="red-filled" />
          <SingpassButton.Default styleType="red-filled" />
          <SingpassButton.Large styleType="red-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes &mdash; white-filled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4 p-4 bg-lifesg-bg-strong rounded">
          <SingpassButton.Small styleType="white-filled" />
          <SingpassButton.Default styleType="white-filled" />
          <SingpassButton.Large styleType="white-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <SingpassButton.Default styleType="red-filled" disabled />
          <SingpassButton.Default styleType="white-filled" disabled />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8" data-testid="sni-singpass-button-lifesg">
      <section>
        <code className="text-xs text-muted-foreground">styles &mdash; default size</code>
        <div className="mt-3 flex flex-wrap items-center gap-4 p-4 bg-lifesg-bg-strong rounded">
          <LifeSGSingpassButton.Default styleType="red-filled" />
          <LifeSGSingpassButton.Default styleType="white-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes &mdash; red-filled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <LifeSGSingpassButton.Small styleType="red-filled" />
          <LifeSGSingpassButton.Default styleType="red-filled" />
          <LifeSGSingpassButton.Large styleType="red-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizes &mdash; white-filled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4 p-4 bg-lifesg-bg-strong rounded">
          <LifeSGSingpassButton.Small styleType="white-filled" />
          <LifeSGSingpassButton.Default styleType="white-filled" />
          <LifeSGSingpassButton.Large styleType="white-filled" />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">disabled</code>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <LifeSGSingpassButton.Default styleType="red-filled" disabled />
          <LifeSGSingpassButton.Default styleType="white-filled" disabled />
        </div>
      </section>
    </div>
  );
}
