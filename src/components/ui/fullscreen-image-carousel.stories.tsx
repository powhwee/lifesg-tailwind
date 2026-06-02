import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  FullscreenImageCarousel,
  type FullscreenImageCarouselItemProps,
  type FullscreenImageItemProps,
} from "./fullscreen-image-carousel";
import { Button } from "./button";

const meta: Meta<typeof FullscreenImageCarousel> = {
  title: "Content/FullscreenImageCarousel",
  component: FullscreenImageCarousel,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FullscreenImageCarousel>;

const PHOTOS: FullscreenImageItemProps[] = [
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80", alt: "Lake at dawn", fileName: "lake.jpg", fileSize: "248 KB" },
  { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80", alt: "Sunset over hills", fileName: "sunset.jpg", fileSize: "312 KB" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80", alt: "Mountain range", fileName: "mountains.jpg", fileSize: "401 KB" },
  { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80", alt: "Forest path", fileName: "forest.jpg", fileSize: "284 KB" },
];

function OpenCarousel({ initial, ...rest }: { initial?: number } & Partial<React.ComponentProps<typeof FullscreenImageCarousel>>) {
  const [show, setShow] = React.useState(true);
  return (
    <div className="p-6">
      <Button onClick={() => setShow(true)}>Re-open carousel</Button>
      <FullscreenImageCarousel
        show={show}
        items={PHOTOS}
        initialActiveItemIndex={initial}
        onClose={() => setShow(false)}
        {...rest}
      />
    </div>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OpenCarousel />,
};

export const StartingMidGallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OpenCarousel initial={2} />,
};

export const HideThumbnails: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OpenCarousel hideThumbnail />,
};

export const HideCounter: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OpenCarousel hideCounter />,
};

export const HideMagnifier: Story = {
  parameters: { controls: { disable: true } },
  render: () => <OpenCarousel hideMagnifier />,
};

export const WithDelete: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [items, setItems] = React.useState(PHOTOS);
    const [show, setShow] = React.useState(true);
    return (
      <div className="p-6">
        <Button onClick={() => { setShow(true); setItems(PHOTOS); }}>Reset & open</Button>
        <FullscreenImageCarousel
          show={show && items.length > 0}
          items={items}
          onClose={() => setShow(false)}
          onDelete={(_, idx) => setItems((cur) => cur.filter((_, i) => i !== idx))}
        />
      </div>
    );
  },
};

export const CustomContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const items: FullscreenImageCarouselItemProps[] = [
      ...PHOTOS.slice(0, 2),
      {
        type: "custom",
        itemLabel: "Document",
        thumbnailSrc: PHOTOS[0].src,
        renderContent: () => (
          <div className="rounded bg-white p-8 max-w-prose mx-auto text-lifesg-text">
            <h2 className="text-component-header leading-component-header font-bold mb-4">
              Inspection report — 2026-05-27
            </h2>
            <p className="text-component-body leading-component-body mb-3">
              Custom content slot — render anything (PDF preview, JSON
              dump, embedded video) instead of an image.
            </p>
            <p className="text-component-body leading-component-body">
              Use this when the carousel doubles as a generic file viewer.
            </p>
          </div>
        ),
      },
    ];
    const [show, setShow] = React.useState(true);
    return (
      <div className="p-6">
        <Button onClick={() => setShow(true)}>Re-open carousel</Button>
        <FullscreenImageCarousel
          show={show}
          items={items}
          initialActiveItemIndex={2}
          onClose={() => setShow(false)}
        />
      </div>
    );
  },
};
