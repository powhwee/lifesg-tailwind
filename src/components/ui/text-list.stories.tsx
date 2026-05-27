import type { Meta, StoryObj } from "@storybook/react";
import { Star } from "lucide-react";
import { UnorderedList, OrderedList } from "./text-list";
import { Stack } from "@/components/storybook-common";

const meta: Meta<typeof UnorderedList> = {
  title: "Core/TextList",
  component: UnorderedList,
  argTypes: {
    size: {
      control: "select",
      options: ["bl", "md", "sm", "xs"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UnorderedList>;

export const UnorderedDefault: Story = {
  render: (args) => (
    <UnorderedList {...args}>
      <span>Apply online via Singpass</span>
      <span>Complete the application form</span>
      <span>Submit and track progress</span>
    </UnorderedList>
  ),
};

export const UnorderedBulletTypes: Story = {
  render: () => (
    <Stack gap={6}>
      <UnorderedList bulletType="disc">
        <span>disc</span>
        <span>second item</span>
      </UnorderedList>
      <UnorderedList bulletType="circle">
        <span>circle</span>
        <span>second item</span>
      </UnorderedList>
      <UnorderedList bulletType="square">
        <span>square</span>
        <span>second item</span>
      </UnorderedList>
    </Stack>
  ),
};

export const UnorderedCustomBullet: Story = {
  render: () => (
    <UnorderedList
      bulletType={<Star className="size-4 text-lifesg-icon-primary" />}
    >
      <span>Custom bullet via React node</span>
      <span>Each item gets its own star</span>
      <span>Useful for highlighted lists</span>
    </UnorderedList>
  ),
};

export const UnorderedNone: Story = {
  render: () => (
    <UnorderedList bulletType="none">
      <span>No bullets — just flush text</span>
      <span>Useful for inline navigation lists</span>
    </UnorderedList>
  ),
};

export const OrderedDecimal: StoryObj<typeof OrderedList> = {
  render: () => (
    <OrderedList counterType="decimal">
      <span>Sign in with Singpass</span>
      <span>Complete the form</span>
      <span>Upload supporting documents</span>
      <span>Submit your application</span>
    </OrderedList>
  ),
};

export const OrderedAlpha: StoryObj<typeof OrderedList> = {
  render: () => (
    <OrderedList counterType="lower-alpha">
      <span>First choice</span>
      <span>Second choice</span>
      <span>Third choice</span>
    </OrderedList>
  ),
};

export const OrderedRoman: StoryObj<typeof OrderedList> = {
  render: () => (
    <OrderedList counterType="lower-roman">
      <span>Eligibility criteria</span>
      <span>Required documents</span>
      <span>Application timeline</span>
      <span>Appeals process</span>
    </OrderedList>
  ),
};

export const OrderedCustomSeparator: StoryObj<typeof OrderedList> = {
  render: () => (
    <OrderedList counterType="decimal" counterSeparator=".">
      <span>Period separator instead of the default parenthesis</span>
      <span>Useful when matching legal-document formatting</span>
    </OrderedList>
  ),
};

export const SizesUnordered: Story = {
  render: () => (
    <Stack gap={6}>
      <UnorderedList size="bl">
        <span>BL — body large</span>
        <span>Second item</span>
      </UnorderedList>
      <UnorderedList size="md">
        <span>MD — body medium (default)</span>
        <span>Second item</span>
      </UnorderedList>
      <UnorderedList size="sm">
        <span>SM — body small</span>
        <span>Second item</span>
      </UnorderedList>
      <UnorderedList size="xs">
        <span>XS — body extra small</span>
        <span>Second item</span>
      </UnorderedList>
    </Stack>
  ),
};
