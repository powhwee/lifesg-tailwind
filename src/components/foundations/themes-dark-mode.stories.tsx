import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OursPane as ThemesDarkModePanel } from "./sections/themes-dark-mode";

const meta: Meta<typeof ThemesDarkModePanel> = {
  title: "Foundations/Themes/Dark Mode",
  component: ThemesDarkModePanel,
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof ThemesDarkModePanel>;

export const Default: Story = {
  render: () => <ThemesDarkModePanel />,
};
