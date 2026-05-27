import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateNavigator } from "./date-navigator";

const meta: Meta<typeof DateNavigator> = {
  title: "Navigation/DateNavigator",
  component: DateNavigator,
  argTypes: {
    view: {
      control: "radio",
      options: ["day", "week"],
    },
    showDateAsShortForm: { control: "boolean" },
    showCurrentDateAsToday: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DateNavigator>;

function Controlled({
  initial = "2026-05-27",
  ...rest
}: Partial<React.ComponentProps<typeof DateNavigator>> & { initial?: string }) {
  const [date, setDate] = React.useState(initial);
  return (
    <DateNavigator
      selectedDate={date}
      onLeftArrowClick={setDate}
      onRightArrowClick={setDate}
      {...rest}
    />
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const ShortForm: Story = {
  render: () => <Controlled showDateAsShortForm />,
};

export const ShowToday: Story = {
  render: () => <Controlled initial={new Date().toISOString().slice(0, 10)} showCurrentDateAsToday />,
};

export const WeekView: Story = {
  render: () => <Controlled view="week" />,
};

export const WithCalendarPicker: Story = {
  render: () => {
    const [date, setDate] = React.useState("2026-05-27");
    return (
      <DateNavigator
        selectedDate={date}
        onLeftArrowClick={setDate}
        onRightArrowClick={setDate}
        onCalendarDateSelect={setDate}
      />
    );
  },
};

export const ClampedRange: Story = {
  render: () => (
    <Controlled
      initial="2026-05-15"
      minDate="2026-05-12"
      maxDate="2026-05-20"
    />
  ),
};

export const LoadingState: Story = {
  render: () => <Controlled loading />,
};
