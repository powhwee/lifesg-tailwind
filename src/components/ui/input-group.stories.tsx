import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupAddon, InputGroupInput, FormInputGroup } from "./input-group";

const meta: Meta<typeof InputGroup> = {
  title: "Form/InputGroup",
  component: InputGroup,
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args}>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput type="text" placeholder="Amount" />
        <InputGroupAddon>SGD</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const LabelAddon: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args}>
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput type="text" placeholder="example.gov.sg" />
      </InputGroup>
    </div>
  ),
};

export const TrailingAddon: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args}>
        <InputGroupInput type="text" placeholder="username" />
        <InputGroupAddon>@gov.sg</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args} error>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput defaultValue="abc" />
      </InputGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args} disabled>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput disabled defaultValue="100" />
        <InputGroupAddon>SGD</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const CompositeFormField: StoryObj<typeof FormInputGroup> = {
  render: (args) => (
    <div className="w-80">
      <FormInputGroup {...args}>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput type="text" placeholder="0.00" />
        <InputGroupAddon>SGD</InputGroupAddon>
      </FormInputGroup>
    </div>
  ),
  args: {
    label: "Monthly income",
    description: "Gross amount before deductions.",
  },
};

export const FormFieldWithError: StoryObj<typeof FormInputGroup> = {
  render: (args) => (
    <div className="w-80">
      <FormInputGroup {...args}>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput defaultValue="abc" />
        <InputGroupAddon>SGD</InputGroupAddon>
      </FormInputGroup>
    </div>
  ),
  args: {
    label: "Monthly income",
    description: "Numeric only.",
    errorMessage: "Please enter a numeric amount.",
  },
};
