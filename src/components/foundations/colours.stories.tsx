import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as ColoursPanel } from "./sections/colours-lifesg";

const meta: Meta<typeof ColoursPanel> = {
  title: "Foundations/Colours",
  component: ColoursPanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof ColoursPanel>;

export const Default: Story = {
  render: () => <ColoursPanel />,
};
