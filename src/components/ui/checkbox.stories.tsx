import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Selection and input/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    displaySize: {
      control: "select",
      options: ["default", "small"],
    },
    disabled: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    displaySize: "default",
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const SmallSize: Story = {
  args: {
    displaySize: "small",
    defaultChecked: true,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox id="chk-1" />
        <label htmlFor="chk-1" className="text-sm">Unchecked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="chk-2" defaultChecked />
        <label htmlFor="chk-2" className="text-sm">Checked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="chk-3" indeterminate />
        <label htmlFor="chk-3" className="text-sm">Indeterminate</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="chk-4" disabled />
        <label htmlFor="chk-4" className="text-sm text-muted-foreground">Disabled Unchecked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="chk-5" defaultChecked disabled />
        <label htmlFor="chk-5" className="text-sm text-muted-foreground">Disabled Checked</label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="chk-6" aria-invalid="true" />
        <label htmlFor="chk-6" className="text-sm text-destructive">Invalid / Error State</label>
      </div>
    </div>
  ),
};
