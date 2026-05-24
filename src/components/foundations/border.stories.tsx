import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as BorderPanel } from "./sections/border-default";

const meta: Meta<typeof BorderPanel> = {
  title: "Foundations/Border",
  component: BorderPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof BorderPanel>;

export const Default: Story = {
  render: () => <BorderPanel />,
};
