"use client";

import { Heart, Search, Settings } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { IconButton as LifeSGIconButton } from "@lifesg/react-design-system/icon-button";
import { HeartIcon } from "@lifesg/react-icons/heart";
import { MagnifierIcon } from "@lifesg/react-icons/magnifier";
import { GearIcon } from "@lifesg/react-icons/gear";

export function OursPane() {
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">styleType</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <IconButton styleType="primary" aria-label="Save"><Heart /></IconButton>
          <IconButton styleType="secondary" aria-label="Search"><Search /></IconButton>
          <IconButton styleType="light" aria-label="Settings"><Settings /></IconButton>
          <IconButton disabled aria-label="Save"><Heart /></IconButton>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizeType</code>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <IconButton sizeType="small" aria-label="Save"><Heart /></IconButton>
          <IconButton sizeType="default" aria-label="Save"><Heart /></IconButton>
          <IconButton sizeType="large" aria-label="Save"><Heart /></IconButton>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">styleType</code>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <LifeSGIconButton styleType="primary" aria-label="Save"><HeartIcon /></LifeSGIconButton>
          <LifeSGIconButton styleType="secondary" aria-label="Search"><MagnifierIcon /></LifeSGIconButton>
          <LifeSGIconButton styleType="light" aria-label="Settings"><GearIcon /></LifeSGIconButton>
          <LifeSGIconButton disabled aria-label="Save"><HeartIcon /></LifeSGIconButton>
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">sizeType</code>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <LifeSGIconButton sizeType="small" aria-label="Save"><HeartIcon /></LifeSGIconButton>
          <LifeSGIconButton sizeType="default" aria-label="Save"><HeartIcon /></LifeSGIconButton>
          <LifeSGIconButton sizeType="large" aria-label="Save"><HeartIcon /></LifeSGIconButton>
        </div>
      </section>
    </div>
  );
}
