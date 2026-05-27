import type { Meta, StoryObj } from "@storybook/react";
import { MaskedInput, FormMaskedInput } from "./masked-input";

const meta: Meta<typeof MaskedInput> = {
  title: "Form/MaskedInput",
  component: MaskedInput,
  argTypes: {
    disableMask: { control: "boolean" },
    maskChar: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof MaskedInput>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "S1234567A",
    placeholder: "NRIC",
  },
};

export const StartUnmasked: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "S1234567A",
    disableMask: true,
  },
};

export const MaskRange: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "S1234567A",
    maskRange: [1, 5],
  },
};

export const UnmaskRange: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "S1234567A",
    unmaskRange: [0, 2],
  },
};

export const MaskRegex: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "S1234567A",
    maskRegex: /[0-9]/,
  },
};

export const CustomMaskChar: Story = {
  render: (args) => (
    <div className="w-80">
      <MaskedInput {...args} />
    </div>
  ),
  args: {
    value: "secret123",
    maskChar: "*",
  },
};

export const CompositeFormField: StoryObj<typeof FormMaskedInput> = {
  render: (args) => (
    <div className="w-80">
      <FormMaskedInput {...args} />
    </div>
  ),
  args: {
    label: "NRIC",
    description: "Last 4 digits shown.",
    value: "S1234567A",
    unmaskRange: [5, 9],
  },
};
