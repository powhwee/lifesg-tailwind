import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

// API examples — single-use cases that exercise the controls panel.
// The full type-scale + weight tour lives in
// typography.system.stories.tsx so each concern stays editable in one place.

const meta: Meta<typeof Typography> = {
  title: "Core/Typography",
  component: Typography,
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

export const LineClamp: Story = {
  args: {
    children:
      "This is a very long paragraph of text that should be clamped to three lines maximum. When it clamps, it will truncate with ellipsis at the end. Storybook lets you adjust maxLines in the controls panel to see how it dynamically scales up or down based on your constraints.",
    maxLines: 2,
    variant: "body-md",
  },
};
