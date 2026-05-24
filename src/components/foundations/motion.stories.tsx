import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as MotionPanel } from "./sections/motion-default";

const meta: Meta<typeof MotionPanel> = {
  title: "Foundations/Motion",
  component: MotionPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof MotionPanel>;

export const Default: Story = {
  render: () => <MotionPanel />,
};
