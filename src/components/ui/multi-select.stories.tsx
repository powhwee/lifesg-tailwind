import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MultiSelect, FormMultiSelect } from "./multi-select";

const mockOptions = [
  { value: "red", label: "Red Cherry" },
  { value: "green", label: "Green Apple" },
  { value: "blue", label: "Blue Berry" },
  { value: "yellow", label: "Yellow Banana" },
  { value: "orange", label: "Orange Mandarin" },
];

const meta: Meta<typeof MultiSelect> = {
  title: "Form/MultiSelect",
  component: MultiSelect,
  argTypes: {
    placeholder: {
      control: "text",
    },
    maxSelectable: {
      control: "number",
    },
    disabled: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions>([]);
    return (
      <MultiSelect
        {...args}
        options={mockOptions}
        selectedOptions={selected}
        onSelectOptions={(opts) => setSelected(opts)}
      />
    );
  },
  args: {
    placeholder: "Choose fruits...",
  },
};

export const MaxSelectable: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions>([]);
    return (
      <MultiSelect
        {...args}
        options={mockOptions}
        selectedOptions={selected}
        onSelectOptions={(opts) => setSelected(opts)}
        maxSelectable={2}
        placeholder="Choose up to 2 fruits..."
      />
    );
  },
};

export const CustomSummary: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions>([]);
    return (
      <MultiSelect
        {...args}
        options={mockOptions}
        selectedOptions={selected}
        onSelectOptions={(opts) => setSelected(opts)}
        formatSummary={(count, labels) =>
          count > 0 ? `Selected: ${labels.join(", ")}` : "Select color preferences..."
        }
      />
    );
  },
};

export const CompositeFormField: StoryObj<typeof FormMultiSelect> = {
  render: (args) => {
    const [selected, setSelected] = React.useState<typeof mockOptions>([]);
    return (
      <FormMultiSelect
        {...args}
        options={mockOptions}
        selectedOptions={selected}
        onSelectOptions={(opts) => setSelected(opts)}
      />
    );
  },
  args: {
    label: "Fruit Preferences",
    description: "Choose your favorite fruits for your weekly subscription pack.",
    placeholder: "Choose fruits...",
  },
};
