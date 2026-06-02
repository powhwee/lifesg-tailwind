import type { Meta, StoryObj } from "@storybook/react";
import { Check, Info, AlertTriangle, X, Heart, Bell } from "lucide-react";
import { Icon } from "./icon";
import { Row, Stack } from "@/components/storybook-common";

const meta: Meta<typeof Icon> = {
  title: "Core/Icon",
  component: Icon,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    tone: {
      control: "select",
      options: [
        "default",
        "subtle",
        "strong",
        "primary",
        "success",
        "warning",
        "error",
        "info",
        "inverse",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    as: Check,
    size: "md",
    tone: "default",
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row gap={6}>
      <Icon as={Check} size="xs" />
      <Icon as={Check} size="sm" />
      <Icon as={Check} size="md" />
      <Icon as={Check} size="lg" />
      <Icon as={Check} size="xl" />
    </Row>
  ),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <Row gap={4}>
        <Icon as={Info} tone="default" size="lg" />
        <Icon as={Info} tone="subtle" size="lg" />
        <Icon as={Info} tone="strong" size="lg" />
        <Icon as={Info} tone="primary" size="lg" />
      </Row>
      <Row gap={4}>
        <Icon as={Check} tone="success" size="lg" />
        <Icon as={AlertTriangle} tone="warning" size="lg" />
        <Icon as={X} tone="error" size="lg" />
        <Icon as={Info} tone="info" size="lg" />
      </Row>
      <Row gap={4}>
        <div className="bg-lifesg-bg-inverse p-2 rounded">
          <Icon as={Bell} tone="inverse" size="lg" />
        </div>
      </Row>
    </Stack>
  ),
};

export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row gap={6}>
      <Icon as={Check} size="lg" />
      <Icon as={Info} size="lg" />
      <Icon as={AlertTriangle} size="lg" />
      <Icon as={X} size="lg" />
      <Icon as={Heart} size="lg" />
      <Icon as={Bell} size="lg" />
    </Row>
  ),
};
