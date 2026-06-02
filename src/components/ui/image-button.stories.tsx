import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ImageButton } from "./image-button";
import { Row } from "@/components/storybook-common";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&q=80&fit=crop", label: "Lake" },
  { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&q=80&fit=crop", label: "Sunset" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&q=80&fit=crop", label: "Mountains" },
  { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&q=80&fit=crop", label: "Forest" },
];

const meta: Meta<typeof ImageButton> = {
  title: "Selection and input/ImageButton",
  component: ImageButton,
  argTypes: {
    selected: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ImageButton>;

export const Default: Story = {
  args: {
    imgSrc: IMAGES[0].src,
    "aria-label": IMAGES[0].label,
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row gap={3}>
      <ImageButton imgSrc={IMAGES[0].src} aria-label="Default" />
      <ImageButton imgSrc={IMAGES[1].src} selected aria-label="Selected" />
      <ImageButton imgSrc={IMAGES[2].src} error aria-label="Error" />
      <ImageButton imgSrc={IMAGES[3].src} disabled aria-label="Disabled" />
    </Row>
  ),
};

export const SelectableGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState(0);
    return (
      <Row gap={3}>
        {IMAGES.map((img, i) => (
          <ImageButton
            key={img.label}
            imgSrc={img.src}
            selected={i === selected}
            onClick={() => setSelected(i)}
            aria-label={img.label}
          />
        ))}
      </Row>
    );
  },
};
