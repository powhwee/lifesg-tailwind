import type { Meta, StoryObj } from "@storybook/react";
import { Settings, Trash2, Heart, Plus } from "lucide-react";
import { IconButton } from "./icon-button";
import { Row } from "@/components/storybook-common";

const meta: Meta<typeof IconButton> = {
  title: "Selection and input/IconButton",
  component: IconButton,
  argTypes: {
    styleType: {
      control: "select",
      options: ["primary", "secondary", "light"],
    },
    sizeType: {
      control: "select",
      options: ["large", "default", "small"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: (args) => (
    <IconButton {...args} aria-label="Settings">
      <Settings />
    </IconButton>
  ),
};

export const StyleTypes: Story = {
  render: () => (
    <Row gap={3}>
      <IconButton styleType="primary" aria-label="Primary action">
        <Plus />
      </IconButton>
      <IconButton styleType="secondary" aria-label="Secondary action">
        <Settings />
      </IconButton>
      <IconButton styleType="light" aria-label="Light action">
        <Heart />
      </IconButton>
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row gap={3}>
      <IconButton sizeType="small" aria-label="Small">
        <Plus />
      </IconButton>
      <IconButton sizeType="default" aria-label="Default">
        <Plus />
      </IconButton>
      <IconButton sizeType="large" aria-label="Large">
        <Plus />
      </IconButton>
    </Row>
  ),
};

export const Destructive: Story = {
  render: () => (
    <IconButton styleType="secondary" aria-label="Delete item">
      <Trash2 className="text-lifesg-text-error" />
    </IconButton>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Row gap={3}>
      <IconButton styleType="primary" disabled aria-label="Primary disabled">
        <Plus />
      </IconButton>
      <IconButton styleType="secondary" disabled aria-label="Secondary disabled">
        <Plus />
      </IconButton>
      <IconButton styleType="light" disabled aria-label="Light disabled">
        <Plus />
      </IconButton>
    </Row>
  ),
};
