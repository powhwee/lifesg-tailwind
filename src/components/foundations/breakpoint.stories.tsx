import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as BreakpointPanel } from "./sections/breakpoint-default";

const meta: Meta<typeof BreakpointPanel> = {
  title: "Foundations/Breakpoint",
  component: BreakpointPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof BreakpointPanel>;

export const Default: Story = {
  render: () => <BreakpointPanel />,
};
