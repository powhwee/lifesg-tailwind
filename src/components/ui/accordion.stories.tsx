import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Content/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
    },
    enableExpandAll: {
      control: "boolean",
    },
    initialDisplay: {
      control: "select",
      options: ["expand-all", "collapse-all"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item title="What is the LifeSG Port?">
        The LifeSG Port replaces the styled-components package dependency with fully-owned Tailwind 4 + shadcn + Base UI component constructs.
      </Accordion.Item>
      <Accordion.Item title="Why drop styled-components?">
        Doing so eliminates runtime CSS evaluation, SWC translation mismatch warnings, and client-side SSR hydration mismatches in Next.js.
      </Accordion.Item>
      <Accordion.Item title="Who maintains this?">
        The codebase is engineered to be easily maintained by a small team of 1-2 developers.
      </Accordion.Item>
    </Accordion>
  ),
  args: {
    title: "FAQ Section",
    enableExpandAll: true,
  },
};

export const SmallVariant: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item title="Accordion Item Small 1" type="small">
        This is a smaller variant of the accordion item, which has tighter paddings and uses smaller header typography.
      </Accordion.Item>
      <Accordion.Item title="Accordion Item Small 2" type="small">
        Ideal for sidebar widgets or data-dense cards where screen real estate is limited.
      </Accordion.Item>
    </Accordion>
  ),
  args: {
    title: "Tighter Accordion",
    enableExpandAll: false,
  },
};
