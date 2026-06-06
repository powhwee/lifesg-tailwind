import type { Meta, StoryObj } from "@storybook/react";
import { SingpassButton } from "./singpass-button";
import { Row, Stack } from "@/components/storybook-common";

const meta: Meta<typeof SingpassButton.Default> = {
  title: "Selection and input/SingpassButton",
  component: SingpassButton.Default,
  argTypes: {
    styleType: {
      control: "select",
      options: ["red-filled", "white-filled"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SingpassButton.Default>;

export const DefaultRedFilled: Story = {
  args: { styleType: "red-filled" },
};

export const DefaultWhiteFilled: Story = {
  args: { styleType: "white-filled" },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <Row>
        <SingpassButton.Small styleType="red-filled" />
        <SingpassButton.Default styleType="red-filled" />
        <SingpassButton.Large styleType="red-filled" />
      </Row>
      <Row>
        <SingpassButton.Small styleType="white-filled" />
        <SingpassButton.Default styleType="white-filled" />
        <SingpassButton.Large styleType="white-filled" />
      </Row>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { styleType: "red-filled", disabled: true },
};
