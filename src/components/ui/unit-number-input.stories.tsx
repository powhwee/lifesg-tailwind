import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { UnitNumberInput, FormUnitNumberInput } from "./unit-number-input";

const meta: Meta<typeof UnitNumberInput> = {
  title: "Form/UnitNumberInput",
  component: UnitNumberInput,
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UnitNumberInput>;

export const Default: Story = {
  render: (args) => <UnitNumberInput {...args} />,
};

export const PreFilled: Story = {
  render: (args) => <UnitNumberInput {...args} defaultValue="04-56" />,
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [v, setV] = React.useState("04-56");
    return (
      <div className="flex flex-col gap-2">
        <UnitNumberInput value={v} onChange={setV} />
        <code className="text-xs text-muted-foreground">value: {JSON.stringify(v)}</code>
      </div>
    );
  },
};

export const ErrorState: Story = {
  render: (args) => <UnitNumberInput {...args} defaultValue="ab-cd" error />,
};

export const Disabled: Story = {
  render: (args) => <UnitNumberInput {...args} defaultValue="04-56" disabled />,
};

export const CompositeFormField: StoryObj<typeof FormUnitNumberInput> = {
  render: (args) => (
    <div className="w-80">
      <FormUnitNumberInput {...args} />
    </div>
  ),
  args: {
    label: "Unit number",
    description: "Format: floor-unit (e.g. 04-56).",
    defaultValue: "04-56",
  },
};

export const FormFieldWithError: StoryObj<typeof FormUnitNumberInput> = {
  render: (args) => (
    <div className="w-80">
      <FormUnitNumberInput {...args} />
    </div>
  ),
  args: {
    label: "Unit number",
    description: "Required.",
    defaultValue: "",
    errorMessage: "Please enter both floor and unit.",
  },
};
