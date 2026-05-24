import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as SpacingPanel } from "./sections/spacing-default";

const meta: Meta<typeof SpacingPanel> = {
  title: "Foundations/Spacing",
  component: SpacingPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof SpacingPanel>;

export const Default: Story = {
  render: () => <SpacingPanel />,
};
