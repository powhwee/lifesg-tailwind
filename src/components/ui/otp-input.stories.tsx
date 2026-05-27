import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { OtpInput } from "./otp-input";

const meta: Meta<typeof OtpInput> = {
  title: "Selection and input/OtpInput",
  component: OtpInput,
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

function ControlledOtp({
  initial,
  ...rest
}: Omit<React.ComponentProps<typeof OtpInput>, "value" | "onChange"> & {
  initial?: string[];
}) {
  const [v, setV] = React.useState<string[]>(initial ?? Array(rest.numOfInput).fill(""));
  return (
    <div className="w-96">
      <OtpInput {...rest} value={v} onChange={setV} />
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledOtp numOfInput={6} cooldownDuration={30} />,
};

export const WithPrefix: Story = {
  render: () => (
    <ControlledOtp
      numOfInput={6}
      cooldownDuration={30}
      prefix={{ value: "OTP", separator: "-" }}
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <ControlledOtp
      numOfInput={6}
      cooldownDuration={30}
      initial={["1", "2", "3", "4", "5", "6"]}
      errorMessage="Invalid OTP. Please try again."
    />
  ),
};

export const FourDigit: Story = {
  render: () => <ControlledOtp numOfInput={4} cooldownDuration={30} />,
};

export const OtpOnly: Story = {
  render: () => <ControlledOtp numOfInput={6} cooldownDuration={30} otpOnly />,
};

export const CustomActionLabel: Story = {
  render: () => (
    <ControlledOtp
      numOfInput={6}
      cooldownDuration={5}
      actionButtonProps={{ children: "Send code" }}
    />
  ),
};
