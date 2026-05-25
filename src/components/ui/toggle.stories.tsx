import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Toggle } from "./toggle";
import { Stack } from "@/components/storybook-common";

const meta: Meta<typeof Toggle> = {
  title: "Selection and input/Toggle",
  component: Toggle,
  argTypes: {
    type: {
      control: "select",
      options: ["checkbox", "radio", "yes", "no"],
    },
    styleType: {
      control: "select",
      options: ["default", "no-border"],
    },
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: "Toggle Card Label",
    subLabel: "This is a secondary description for the toggle card.",
    type: "checkbox",
  },
};

export const Checked: Story = {
  args: {
    children: "Selected Option",
    subLabel: "This option is checked by default.",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Option",
    subLabel: "This card cannot be clicked.",
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    children: "Terms and Conditions",
    subLabel: "You must accept this field to proceed.",
    error: true,
  },
};

export const CompositeSection: Story = {
  args: {
    children: "Advanced Settings",
    subLabel: "Check this to reveal additional options.",
    compositeSection: (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Configure the advanced parameters below:</p>
        <input type="text" placeholder="api-key-here" className="h-10 px-3 border border-border rounded text-sm w-full bg-white text-lifesg-text focus-visible:outline-2 focus-visible:outline-lifesg-border-focus" />
      </div>
    ),
  },
};

export const ToggleGroup: Story = {
  render: () => (
    <Stack gap={3} className="max-w-md">
      <Toggle type="radio" name="grp" defaultChecked>
        Option A
      </Toggle>
      <Toggle type="radio" name="grp">
        Option B
      </Toggle>
      <Toggle type="radio" name="grp">
        Option C
      </Toggle>
    </Stack>
  ),
};
