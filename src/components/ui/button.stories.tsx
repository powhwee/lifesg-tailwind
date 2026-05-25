import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Row, Stack } from "@/components/storybook-common";

const meta: Meta<typeof Button> = {
  title: "Selection and input/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive Button",
    variant: "destructive",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack>
      <Row>
        <Button {...args} size="xs">Extra Small</Button>
        <Button {...args} size="sm">Small</Button>
        <Button {...args} size="default">Default</Button>
        <Button {...args} size="lg">Large</Button>
      </Row>
      <Row>
        <Button {...args} size="icon-xs" title="Icon XS">X</Button>
        <Button {...args} size="icon-sm" title="Icon SM">S</Button>
        <Button {...args} size="icon" title="Icon Default">D</Button>
        <Button {...args} size="icon-lg" title="Icon LG">L</Button>
      </Row>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};
