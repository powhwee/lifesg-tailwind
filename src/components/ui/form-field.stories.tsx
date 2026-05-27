import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Input } from "./input";

const meta: Meta<typeof FormField> = {
  title: "Form/FormField",
  component: FormField,
  argTypes: {
    disabled: { control: "boolean" },
    reserveErrorSlot: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        <Input placeholder="Enter your email" />
      </FormField>
    </div>
  ),
  args: {
    label: "Email address",
  },
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        <Input placeholder="jane_doe" />
      </FormField>
    </div>
  ),
  args: {
    label: "Username",
    description: "Letters, numbers, and underscores only.",
  },
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        <Input defaultValue="12" aria-invalid="true" />
      </FormField>
    </div>
  ),
  args: {
    label: "Postal code",
    description: "6-digit Singapore postal code.",
    errorMessage: "Postal code must be exactly 6 digits.",
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        <Input defaultValue="ACC-00421" disabled />
      </FormField>
    </div>
  ),
  args: {
    label: "Account ID",
    description: "Read-only system identifier.",
    disabled: true,
  },
};

export const ReservedErrorSlot: Story = {
  render: (args) => (
    <div className="w-80 border border-dashed border-lifesg-border p-3">
      <FormField {...args}>
        <Input placeholder="Enter a value" />
      </FormField>
      <p className="mt-2 text-xs text-muted-foreground">
        The dashed box stays the same height whether or not an error renders.
      </p>
    </div>
  ),
  args: {
    label: "Composite input",
    reserveErrorSlot: true,
  },
};
