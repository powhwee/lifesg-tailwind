import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as RadiusPanel } from "./sections/radius-default";

const meta: Meta<typeof RadiusPanel> = {
  title: "Foundations/Radius",
  component: RadiusPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof RadiusPanel>;

export const Default: Story = {
  render: () => <RadiusPanel />,
};
