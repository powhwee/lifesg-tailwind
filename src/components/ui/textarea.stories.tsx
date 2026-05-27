import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Textarea, FormTextarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Form/Textarea",
  component: Textarea,
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    showCounter: { control: "boolean" },
    maxLength: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
  args: {
    placeholder: "Share your feedback…",
  },
};

export const WithCounter: Story = {
  render: (args) => {
    const [val, setVal] = React.useState("");
    return (
      <div className="w-96">
        <Textarea
          {...args}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>
    );
  },
  args: {
    placeholder: "Up to 280 characters",
    maxLength: 280,
    showCounter: true,
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
  args: {
    placeholder: "Cannot edit",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
  args: {
    defaultValue:
      "This content is read-only — useful for showing a previously submitted response without re-collecting it.",
    readOnly: true,
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
  args: {
    placeholder: "Describe the issue",
    "aria-invalid": "true",
  },
};

export const CompositeFormField: StoryObj<typeof FormTextarea> = {
  render: (args) => (
    <div className="w-96">
      <FormTextarea {...args} />
    </div>
  ),
  args: {
    label: "Tell us more",
    description: "Optional — additional context helps us respond faster.",
    placeholder: "Type a few sentences…",
  },
};

export const FormFieldWithError: StoryObj<typeof FormTextarea> = {
  render: (args) => (
    <div className="w-96">
      <FormTextarea {...args} />
    </div>
  ),
  args: {
    label: "Reason for request",
    description: "Required.",
    defaultValue: "ok",
    errorMessage: "Please provide at least 20 characters.",
    "aria-invalid": "true",
  },
};
