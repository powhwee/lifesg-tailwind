import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RadioButton, RadioGroup } from "./radio-button";
import { LabeledControl, Stack } from "@/components/storybook-common";

const meta: Meta<typeof RadioButton> = {
  title: "Selection and input/RadioButton",
  component: RadioButton,
  argTypes: {
    displaySize: {
      control: "select",
      options: ["default", "small"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="1" className="flex flex-col gap-3">
      <LabeledControl htmlFor="rad-1" control={<RadioButton {...args} value="1" id="rad-1" />}>
        Option 1
      </LabeledControl>
      <LabeledControl htmlFor="rad-2" control={<RadioButton {...args} value="2" id="rad-2" />}>
        Option 2
      </LabeledControl>
    </RadioGroup>
  ),
  args: {
    displaySize: "default",
  },
};

export const SmallSize: Story = {
  render: (args) => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <LabeledControl htmlFor="rad-a" control={<RadioButton {...args} value="a" id="rad-a" />}>
        Small Option A
      </LabeledControl>
      <LabeledControl htmlFor="rad-b" control={<RadioButton {...args} value="b" id="rad-b" />}>
        Small Option B
      </LabeledControl>
    </RadioGroup>
  ),
  args: {
    displaySize: "small",
  },
};

export const States: Story = {
  render: () => (
    <Stack>
      <RadioGroup defaultValue="">
        <LabeledControl htmlFor="r-1" control={<RadioButton value="unchk" id="r-1" />}>
          Unchecked
        </LabeledControl>
      </RadioGroup>
      <RadioGroup defaultValue="chk">
        <LabeledControl htmlFor="r-2" control={<RadioButton value="chk" id="r-2" />}>
          Checked
        </LabeledControl>
      </RadioGroup>
      <RadioGroup defaultValue="">
        <LabeledControl
          htmlFor="r-3"
          control={<RadioButton value="disabled-unchk" id="r-3" disabled />}
          labelClassName="text-muted-foreground"
        >
          Disabled Unchecked
        </LabeledControl>
      </RadioGroup>
      <RadioGroup defaultValue="disabled-chk">
        <LabeledControl
          htmlFor="r-4"
          control={<RadioButton value="disabled-chk" id="r-4" disabled />}
          labelClassName="text-muted-foreground"
        >
          Disabled Checked
        </LabeledControl>
      </RadioGroup>
      <RadioGroup defaultValue="">
        <LabeledControl
          htmlFor="r-5"
          control={<RadioButton value="invalid" id="r-5" aria-invalid="true" />}
          labelClassName="text-destructive"
        >
          Invalid / Error State
        </LabeledControl>
      </RadioGroup>
    </Stack>
  ),
};
