import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";
import { Stack } from "@/components/storybook-common";

const meta: Meta<typeof Divider> = {
  title: "Core/Divider",
  component: Divider,
  argTypes: {
    thickness: {
      control: { type: "number", min: 1, max: 8, step: 1 },
    },
    lineStyle: {
      control: "select",
      options: ["solid", "dashed"],
    },
    color: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
};

export const Dashed: Story = {
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
  args: {
    lineStyle: "dashed",
  },
};

export const Thickness: Story = {
  render: () => (
    <Stack gap={8} className="w-96">
      <Divider thickness={1} />
      <Divider thickness={2} />
      <Divider thickness={4} />
      <Divider thickness={8} />
    </Stack>
  ),
};

export const CustomColor: Story = {
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
  args: {
    color: "#3C91EC",
    thickness: 2,
  },
};
