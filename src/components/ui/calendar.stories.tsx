import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Form/Calendar",
  component: Calendar,
  argTypes: {
    styleType: {
      control: "radio",
      options: ["no-border", "bordered"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = React.useState("2026-05-27");
    return <Calendar variant="single" value={val} onChange={setVal} />;
  },
};

export const Bordered: Story = {
  render: () => {
    const [val, setVal] = React.useState("2026-05-27");
    return (
      <Calendar
        variant="single"
        styleType="bordered"
        value={val}
        onChange={setVal}
      />
    );
  },
};

export const Multi: Story = {
  render: () => {
    const [vals, setVals] = React.useState<string[]>([
      "2026-05-10",
      "2026-05-15",
      "2026-05-22",
    ]);
    return <Calendar variant="multi" values={vals} onChange={setVals} />;
  },
};

export const MultiWithLimit: Story = {
  render: () => {
    const [vals, setVals] = React.useState<string[]>([]);
    return (
      <Calendar
        variant="multi"
        values={vals}
        onChange={setVals}
        minSelectable={2}
        maxSelectable={4}
      />
    );
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [val, setVal] = React.useState("2026-05-15");
    return (
      <Calendar
        variant="single"
        value={val}
        onChange={setVal}
        minDate="2026-05-05"
        maxDate="2026-05-25"
      />
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [val, setVal] = React.useState("2026-05-27");
    return (
      <Calendar
        variant="single"
        value={val}
        onChange={setVal}
        disabledDates={["2026-05-10", "2026-05-11", "2026-05-12", "2026-05-22"]}
      />
    );
  },
};
