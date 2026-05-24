import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Core/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "heading-xxl",
        "heading-xl",
        "heading-lg",
        "heading-md",
        "heading-sm",
        "heading-xs",
        "body-bl",
        "body-md",
        "body-sm",
        "body-xs",
      ],
    },
    weight: {
      control: "select",
      options: ["light", "regular", "semibold", "bold"],
    },
    paragraph: {
      control: "boolean",
    },
    maxLines: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    children: "This is body-md text representing standard copy.",
    variant: "body-md",
  },
};

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="heading-xxl" weight="bold">Heading XXL (30px/38px)</Typography>
      <Typography variant="heading-xl" weight="bold">Heading XL (26px/34px)</Typography>
      <Typography variant="heading-lg" weight="bold">Heading LG (24px/32px)</Typography>
      <Typography variant="heading-md" weight="bold">Heading MD (20px/28px)</Typography>
      <Typography variant="heading-sm" weight="bold">Heading SM (18px/26px)</Typography>
      <Typography variant="heading-xs" weight="bold">Heading XS (16px/24px)</Typography>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="body-bl">Body BL (18px/28px) — Extra large body text for callouts.</Typography>
      <Typography variant="body-md">Body MD (16px/24px) — Standard body text.</Typography>
      <Typography variant="body-sm">Body SM (14px/26px) — Smaller body text (spacious line height).</Typography>
      <Typography variant="body-xs">Body XS (12px/20px) — Extra small captions/helper labels.</Typography>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="body-md" weight="light">Light weight copy text.</Typography>
      <Typography variant="body-md" weight="regular">Regular weight copy text.</Typography>
      <Typography variant="body-md" weight="semibold">Semibold weight copy text.</Typography>
      <Typography variant="body-md" weight="bold">Bold weight copy text.</Typography>
    </div>
  ),
};

export const LineClamp: Story = {
  args: {
    children: "This is a very long paragraph of text that should be clamped to three lines maximum. When it clamps, it will truncate with ellipsis at the end. Storybook lets you adjust maxLines in the controls panel to see how it dynamically scales up or down based on your constraints.",
    maxLines: 2,
    variant: "body-md",
  },
};
