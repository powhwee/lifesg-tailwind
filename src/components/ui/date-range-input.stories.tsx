import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateRangeInput, FormDateRangeInput } from "./date-range-input";

const meta: Meta<typeof DateRangeInput> = {
  title: "Form/DateRangeInput",
  component: DateRangeInput,
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeInput>;

function ControlledRange({
  initialStart = "",
  initialEnd = "",
  ...rest
}: Omit<
  React.ComponentProps<typeof DateRangeInput>,
  "value" | "valueEnd" | "onChange"
> & {
  initialStart?: string;
  initialEnd?: string;
}) {
  const [start, setStart] = React.useState(initialStart);
  const [end, setEnd] = React.useState(initialEnd);
  return (
    <div className="w-96">
      <DateRangeInput
        {...rest}
        value={start}
        valueEnd={end}
        onChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        from: <code>{JSON.stringify(start)}</code> · to:{" "}
        <code>{JSON.stringify(end)}</code>
      </p>
    </div>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledRange />,
};

export const PreFilled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRange initialStart="2026-05-12" initialEnd="2026-05-20" />
  ),
};

export const WithMinMax: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRange
      initialStart="2026-05-15"
      initialEnd="2026-05-18"
      minDate="2026-05-05"
      maxDate="2026-05-28"
    />
  ),
};

export const ErrorState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRange initialStart="2026-05-12" initialEnd="2026-05-20" error />
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRange initialStart="2026-05-12" initialEnd="2026-05-20" disabled />
  ),
};

export const CompositeFormField: StoryObj<typeof FormDateRangeInput> = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [start, setStart] = React.useState("");
    const [end, setEnd] = React.useState("");
    return (
      <div className="w-96">
        <FormDateRangeInput
          label="Booking period"
          description="Choose your check-in and check-out dates."
          value={start}
          valueEnd={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />
      </div>
    );
  },
};
