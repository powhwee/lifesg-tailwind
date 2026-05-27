import type { Meta, StoryObj } from "@storybook/react";
import { Masthead } from "./masthead";

const meta: Meta<typeof Masthead> = {
  title: "Navigation/Masthead",
  component: Masthead,
  parameters: { layout: "fullscreen" },
  argTypes: {
    stretch: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Masthead>;

export const Default: Story = {
  render: (args) => <Masthead {...args} />,
};

export const Stretched: Story = {
  render: (args) => <Masthead {...args} stretch />,
};
