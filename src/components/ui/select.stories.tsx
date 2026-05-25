import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Select, FormSelect } from "./select";

const mockOptions = [
  { value: "singapore", label: "Singapore" },
  { value: "malaysia", label: "Malaysia" },
  { value: "indonesia", label: "Indonesia" },
  { value: "thailand", label: "Thailand" },
  { value: "vietnam", label: "Vietnam" },
];

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
  argTypes: {
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions[number] | null>(null);
    return (
      <Select
        {...args}
        options={mockOptions}
        selectedOption={selected}
        onSelectOption={(opt) => setSelected(opt)}
      />
    );
  },
  args: {
    placeholder: "Select country...",
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Select
      {...args}
      options={mockOptions}
      disabled
    />
  ),
};

export const ErrorState: Story = {
  render: (args) => (
    <Select
      {...args}
      options={mockOptions}
      error
      placeholder="Select country..."
    />
  ),
};

export const CompositeFormField: StoryObj<typeof FormSelect> = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions[number] | null>(null);
    return (
      <FormSelect
        {...args}
        options={mockOptions}
        selectedOption={selected}
        onSelectOption={(opt) => setSelected(opt)}
      />
    );
  },
  args: {
    label: "Country of Residence",
    description: "Select the primary country where you currently reside.",
    placeholder: "Select country...",
  },
};
