import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  PhoneNumberInput,
  FormPhoneNumberInput,
  type PhoneNumberInputValue,
} from "./phone-number-input";

const meta: Meta<typeof PhoneNumberInput> = {
  title: "Form/PhoneNumberInput",
  component: PhoneNumberInput,
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
    fixedCountry: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneNumberInput>;

function ControlledPhone({
  initial,
  ...rest
}: Omit<React.ComponentProps<typeof PhoneNumberInput>, "value" | "onChange"> & {
  initial?: PhoneNumberInputValue;
}) {
  const [v, setV] = React.useState<PhoneNumberInputValue>(initial ?? { countryCode: "+65" });
  return (
    <div className="w-80">
      <PhoneNumberInput {...rest} value={v} onChange={setV} />
    </div>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledPhone />,
};

export const PreFilled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPhone initial={{ countryCode: "+65", number: "91234567" }} />
  ),
};

export const FixedCountry: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPhone
      initial={{ countryCode: "+65", number: "91234567" }}
      fixedCountry
    />
  ),
};

export const ErrorState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPhone initial={{ countryCode: "+65", number: "abc" }} error />
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledPhone initial={{ countryCode: "+65", number: "91234567" }} disabled />
  ),
};

export const CompositeFormField: StoryObj<typeof FormPhoneNumberInput> = {
  render: (args) => {
    const [v, setV] = React.useState<PhoneNumberInputValue>({ countryCode: "+65" });
    return (
      <div className="w-80">
        <FormPhoneNumberInput {...args} value={v} onChange={setV} />
      </div>
    );
  },
  args: {
    label: "Mobile number",
    description: "We'll use this to send the OTP.",
  },
};
