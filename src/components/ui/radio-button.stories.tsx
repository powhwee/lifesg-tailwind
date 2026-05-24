import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RadioButton, RadioGroup } from "./radio-button";

const meta: Meta<typeof RadioButton> = {
  title: "Selection and input/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
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
      <div className="flex items-center gap-3">
        <RadioButton {...args} value="1" id="rad-1" />
        <label htmlFor="rad-1" className="text-sm">Option 1</label>
      </div>
      <div className="flex items-center gap-3">
        <RadioButton {...args} value="2" id="rad-2" />
        <label htmlFor="rad-2" className="text-sm">Option 2</label>
      </div>
    </RadioGroup>
  ),
  args: {
    displaySize: "default",
  },
};

export const SmallSize: Story = {
  render: (args) => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <RadioButton {...args} value="a" id="rad-a" />
        <label htmlFor="rad-a" className="text-sm">Small Option A</label>
      </div>
      <div className="flex items-center gap-3">
        <RadioButton {...args} value="b" id="rad-b" />
        <label htmlFor="rad-b" className="text-sm">Small Option B</label>
      </div>
    </RadioGroup>
  ),
  args: {
    displaySize: "small",
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <RadioGroup defaultValue="">
        <div className="flex items-center gap-3">
          <RadioButton value="unchk" id="r-1" />
          <label htmlFor="r-1" className="text-sm">Unchecked</label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="chk">
        <div className="flex items-center gap-3">
          <RadioButton value="chk" id="r-2" />
          <label htmlFor="r-2" className="text-sm">Checked</label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="">
        <div className="flex items-center gap-3">
          <RadioButton value="disabled-unchk" id="r-3" disabled />
          <label htmlFor="r-3" className="text-sm text-muted-foreground">Disabled Unchecked</label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="disabled-chk">
        <div className="flex items-center gap-3">
          <RadioButton value="disabled-chk" id="r-4" disabled />
          <label htmlFor="r-4" className="text-sm text-muted-foreground">Disabled Checked</label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="">
        <div className="flex items-center gap-3">
          <RadioButton value="invalid" id="r-5" aria-invalid="true" />
          <label htmlFor="r-5" className="text-sm text-destructive">Invalid / Error State</label>
        </div>
      </RadioGroup>
    </div>
  ),
};
