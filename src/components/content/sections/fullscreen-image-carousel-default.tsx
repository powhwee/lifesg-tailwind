"use client";

import * as React from "react";
import { FullscreenImageCarousel, type FullscreenImageCarouselItemProps } from "@/components/ui/fullscreen-image-carousel";
import { FullscreenImageCarousel as LifeSGFullscreenImageCarousel } from "@lifesg/react-design-system/fullscreen-image-carousel";
import { Button } from "@/components/ui/button";

// Picsum is a stable placeholder image service.
const items: FullscreenImageCarouselItemProps[] = [
  { src: "https://picsum.photos/id/1015/1200/800", alt: "River bend with snow-capped peaks", thumbnailSrc: "https://picsum.photos/id/1015/160/120", fileName: "river-bend.jpg" },
  { src: "https://picsum.photos/id/1018/1200/800", alt: "Forest landscape with mountains",   thumbnailSrc: "https://picsum.photos/id/1018/160/120", fileName: "forest.jpg"     },
  { src: "https://picsum.photos/id/1043/1200/800", alt: "Mountain lake at dusk",             thumbnailSrc: "https://picsum.photos/id/1043/160/120", fileName: "lake-dusk.jpg" },
];

function OursDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>Open carousel (ours)</Button>
      <FullscreenImageCarousel
        show={show}
        items={items}
        onClose={() => setShow(false)}
      />
    </>
  );
}

function LifeSGDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>Open carousel (LifeSG)</Button>
      <LifeSGFullscreenImageCarousel
        show={show}
        items={items}
        onClose={() => setShow(false)}
      />
    </>
  );
}

export function OursPane() {
  return (
    <div className="flex flex-col gap-4" data-token="default">
      <p className="text-xs text-muted-foreground">
        Click to open.
      </p>
      <OursDemo />
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-4" data-token="default">
      <p className="text-xs text-muted-foreground">
        Click to open.
      </p>
      <LifeSGDemo />
    </div>
  );
}
