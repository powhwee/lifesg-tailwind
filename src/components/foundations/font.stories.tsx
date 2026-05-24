import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as FontPanel } from "./sections/font-default";

const meta: Meta<typeof FontPanel> = {
  title: "Foundations/Font",
  component: FontPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof FontPanel>;

export const Default: Story = {
  render: () => <FontPanel />,
};
