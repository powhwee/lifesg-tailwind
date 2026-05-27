import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./divider";

// API examples — single-use cases that exercise the controls panel.
// The full thickness scale + grid-integration tour lives in
// divider.system.stories.tsx so each concern stays editable in one place.

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
