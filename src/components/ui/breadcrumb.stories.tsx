import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    separator: {
      control: "select",
      options: ["chevron", "slash"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    separator: "chevron",
    links: [
      { href: "#", children: "Home" },
      { href: "#", children: "Dashboard" },
      { href: "#", children: "CareerNav" },
      { href: "#", children: "Profile Settings" },
    ],
  },
};

export const SlashSeparator: Story = {
  args: {
    separator: "slash",
    links: [
      { href: "#", children: "Library" },
      { href: "#", children: "Documents" },
      { href: "#", children: "Guidelines" },
    ],
  },
};
