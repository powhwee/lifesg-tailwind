import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { LabeledControl, Stack } from "@/components/storybook-common";

const meta: Meta<typeof Checkbox> = {
  title: "Selection and input/Checkbox",
  component: Checkbox,
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
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <LabeledControl htmlFor="chk-1" control={<Checkbox id="chk-1" />}>
        Unchecked
      </LabeledControl>
      <LabeledControl htmlFor="chk-2" control={<Checkbox id="chk-2" defaultChecked />}>
        Checked
      </LabeledControl>
      <LabeledControl htmlFor="chk-3" control={<Checkbox id="chk-3" indeterminate />}>
        Indeterminate
      </LabeledControl>
      <LabeledControl
        htmlFor="chk-4"
        control={<Checkbox id="chk-4" disabled />}
        labelClassName="text-muted-foreground"
      >
        Disabled Unchecked
      </LabeledControl>
      <LabeledControl
        htmlFor="chk-5"
        control={<Checkbox id="chk-5" defaultChecked disabled />}
        labelClassName="text-muted-foreground"
      >
        Disabled Checked
      </LabeledControl>
      <LabeledControl
        htmlFor="chk-6"
        control={<Checkbox id="chk-6" aria-invalid="true" />}
        labelClassName="text-destructive"
      >
        Invalid / Error State
      </LabeledControl>
    </Stack>
  ),
};
