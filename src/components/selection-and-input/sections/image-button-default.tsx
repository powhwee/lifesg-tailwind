"use client";

import { useState } from "react";
import { ImageButton } from "@/components/ui/image-button";
import { ImageButton as LifeSGImageButton } from "@lifesg/react-design-system/image-button";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&q=80&fit=crop", label: "Lake" },
  { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&q=80&fit=crop", label: "Sunset" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&q=80&fit=crop", label: "Mountains" },
  { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&q=80&fit=crop", label: "Forest" },
];

export function OursPane() {
  const [selected, setSelected] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">selectable group</code>
        <div className="mt-3 grid grid-cols-4 gap-3 max-w-md">
          {IMAGES.map((img, i) => (
            <ImageButton
              key={img.label}
              imgSrc={img.src}
              selected={selected === i}
              onClick={() => setSelected(i)}
              aria-label={img.label}
            />
          ))}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <div className="mt-3 grid grid-cols-4 gap-3 max-w-md">
          <ImageButton imgSrc={IMAGES[0].src} aria-label="Default" />
          <ImageButton imgSrc={IMAGES[1].src} selected aria-label="Selected" />
          <ImageButton imgSrc={IMAGES[2].src} error aria-label="Error" />
          <ImageButton imgSrc={IMAGES[3].src} disabled aria-label="Disabled" />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [selected, setSelected] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">selectable group</code>
        <div className="mt-3 grid grid-cols-4 gap-3 max-w-md">
          {IMAGES.map((img, i) => (
            <LifeSGImageButton
              key={img.label}
              imgSrc={img.src}
              selected={selected === i}
              onClick={() => setSelected(i)}
              aria-label={img.label}
              style={{ aspectRatio: "1 / 1" }}
            />
          ))}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">states</code>
        <div className="mt-3 grid grid-cols-4 gap-3 max-w-md">
          <LifeSGImageButton imgSrc={IMAGES[0].src} aria-label="Default" style={{ aspectRatio: "1 / 1" }} />
          <LifeSGImageButton imgSrc={IMAGES[1].src} selected aria-label="Selected" style={{ aspectRatio: "1 / 1" }} />
          <LifeSGImageButton imgSrc={IMAGES[2].src} error aria-label="Error" style={{ aspectRatio: "1 / 1" }} />
          <LifeSGImageButton imgSrc={IMAGES[3].src} disabled aria-label="Disabled" style={{ aspectRatio: "1 / 1" }} />
        </div>
      </section>
    </div>
  );
}
