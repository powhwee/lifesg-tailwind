import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as ShadowPanel } from "./sections/shadow-default";

const meta: Meta<typeof ShadowPanel> = {
  title: "Foundations/Shadow",
  component: ShadowPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof ShadowPanel>;

export const Default: Story = {
  render: () => <ShadowPanel />,
};
