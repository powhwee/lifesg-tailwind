import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Stack } from "@/components/storybook-common";

const meta: Meta<typeof Label> = {
  title: "Form/Label",
  component: Label,
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email address",
    htmlFor: "label-default",
  },
};

export const Disabled: Story = {
  args: {
    children: "Cannot edit",
    htmlFor: "label-disabled",
    disabled: true,
  },
};

export const WithRequiredMark: Story = {
  render: () => (
    <Label htmlFor="label-required">
      Full legal name
      <span aria-hidden="true" className="text-lifesg-text-error">*</span>
    </Label>
  ),
};

export const States: Story = {
  render: () => (
    <Stack>
      <Label htmlFor="lbl-1">Default label</Label>
      <Label htmlFor="lbl-2">
        Required label
        <span aria-hidden="true" className="text-lifesg-text-error">*</span>
      </Label>
      <Label htmlFor="lbl-3" disabled>
        Disabled label
      </Label>
    </Stack>
  ),
};
