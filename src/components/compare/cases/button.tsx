"use client";

import { Button as ShadcnButton } from "@/components/ui/button";
import { Button as LifeSGButton } from "@lifesg/react-design-system/button";

export function ButtonShadcnCases() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <ShadcnButton>Primary</ShadcnButton>
      <ShadcnButton variant="secondary">Secondary</ShadcnButton>
      <ShadcnButton variant="ghost">Ghost</ShadcnButton>
      <ShadcnButton variant="link">Link</ShadcnButton>
      <ShadcnButton variant="destructive">Destructive</ShadcnButton>
      <ShadcnButton disabled>Disabled</ShadcnButton>
    </div>
  );
}

export function ButtonLifeSGCases() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <LifeSGButton.Default>Primary</LifeSGButton.Default>
      <LifeSGButton.Default styleType="secondary">Secondary</LifeSGButton.Default>
      <LifeSGButton.Default styleType="light">Ghost</LifeSGButton.Default>
      <LifeSGButton.Default styleType="link">Link</LifeSGButton.Default>
      <LifeSGButton.Default danger>Destructive</LifeSGButton.Default>
      <LifeSGButton.Default disabled>Disabled</LifeSGButton.Default>
    </div>
  );
}
