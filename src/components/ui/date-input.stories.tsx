import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateInput, FormDateInput } from "./date-input";

const meta: Meta<typeof DateInput> = {
  title: "Form/DateInput",
  component: DateInput,
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
    withButton: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

function ControlledDateInput({
  initial,
  ...rest
}: Omit<React.ComponentProps<typeof DateInput>, "value" | "onChange"> & {
  initial?: string;
}) {
  const [v, setV] = React.useState(initial ?? "");
  return (
    <div className="w-72">
      <DateInput {...rest} value={v} onChange={setV} />
      <p className="mt-2 text-xs text-muted-foreground">
        value: <code>{JSON.stringify(v)}</code>
      </p>
    </div>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledDateInput />,
};

export const PreFilled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledDateInput initial="2026-05-27" />,
};

export const WithMinMax: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledDateInput
      initial="2026-05-15"
      minDate="2026-05-05"
      maxDate="2026-05-25"
    />
  ),
};

export const WithDisabledDates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledDateInput
      initial="2026-05-13"
      disabledDates={["2026-05-10", "2026-05-11", "2026-05-12"]}
    />
  ),
};

export const WithDoneButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledDateInput withButton />,
};

export const ErrorState: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledDateInput initial="2026-05-27" error />,
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledDateInput initial="2026-05-27" disabled />,
};

export const CompositeFormField: StoryObj<typeof FormDateInput> = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [v, setV] = React.useState("");
    return (
      <div className="w-80">
        <FormDateInput
          label="Date of birth"
          description="Use the calendar or type DD/MM/YYYY."
          value={v}
          onChange={setV}
        />
      </div>
    );
  },
};

export const FormFieldWithError: StoryObj<typeof FormDateInput> = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [v, setV] = React.useState("2026-05-27");
    return (
      <div className="w-80">
        <FormDateInput
          label="Date of birth"
          description="Required."
          value={v}
          onChange={setV}
          errorMessage="Selected date must be in the past."
        />
      </div>
    );
  },
};
