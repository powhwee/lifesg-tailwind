import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Input, FormInput } from "./input";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    allowClear: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter some text...",
    disabled: false,
    readOnly: false,
  },
};

export const Clearable: Story = {
  render: (args) => {
    const [val, setVal] = React.useState("Clear me!");
    return (
      <Input
        {...args}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onClear={() => setVal("")}
        allowClear
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: "Read-only text content",
    readOnly: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Error state input",
    "aria-invalid": "true",
  },
};

export const CompositeFormField: StoryObj<typeof FormInput> = {
  render: (args) => (
    <FormInput {...args} />
  ),
  args: {
    label: "Username / Email",
    description: "Please enter your registered user credentials to sign in.",
    placeholder: "user@example.com",
  },
};

export const FormFieldWithError: StoryObj<typeof FormInput> = {
  render: (args) => (
    <FormInput {...args} />
  ),
  args: {
    label: "Zip Code",
    description: "6-digit postal zip code.",
    placeholder: "123456",
    errorMessage: "Postal code must be exactly 6 digits.",
    "aria-invalid": "true",
  },
};
