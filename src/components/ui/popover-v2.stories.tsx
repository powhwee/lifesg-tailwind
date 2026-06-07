import type { Meta, StoryObj } from "@storybook/react";
import { Info, HelpCircle } from "lucide-react";
import { PopoverV2 } from "./popover-v2";
import { Button } from "./button";
import { Stack } from "@/components/storybook-common";

const meta: Meta<typeof PopoverV2.Trigger> = {
  title: "Overlays/PopoverV2",
  component: PopoverV2.Trigger,
  argTypes: {
    trigger: { control: "select", options: ["click", "hover"] },
    position: {
      control: "select",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "top-start",
        "top-end",
        "bottom-start",
        "bottom-end",
      ],
    },
    customOffset: { control: { type: "number", min: 0, max: 64 } },
  },
};

export default meta;
type Story = StoryObj<typeof PopoverV2.Trigger>;

export const ClickTrigger: Story = {
  args: {
    trigger: "click",
    popoverContent:
      "Click the trigger to open this panel. Click outside to dismiss.",
    children: <Button variant="outline">Click me</Button>,
  },
};

export const HoverTrigger: Story = {
  args: {
    trigger: "hover",
    delay: { open: 100, close: 250 },
    popoverContent: "Hover the trigger to peek at this panel.",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const PositionTour: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack gap={8} className="p-16">
      <div className="flex gap-12 items-center justify-center">
        <PopoverV2.Trigger position="top" popoverContent="Top of trigger">
          <Button variant="outline">Top</Button>
        </PopoverV2.Trigger>
        <PopoverV2.Trigger position="bottom" popoverContent="Bottom of trigger">
          <Button variant="outline">Bottom</Button>
        </PopoverV2.Trigger>
        <PopoverV2.Trigger position="left" popoverContent="Left of trigger">
          <Button variant="outline">Left</Button>
        </PopoverV2.Trigger>
        <PopoverV2.Trigger position="right" popoverContent="Right of trigger">
          <Button variant="outline">Right</Button>
        </PopoverV2.Trigger>
      </div>
    </Stack>
  ),
};

export const CustomOffset: Story = {
  args: {
    customOffset: 32,
    popoverContent: "Notice the larger gap between trigger and popover.",
    children: <Button variant="outline">32px offset</Button>,
  },
};

export const RichContent: Story = {
  args: {
    popoverContent: (
      <PopoverV2 ariaLabel="Rich content example">
        <h3 className="font-semibold mb-2">Eligibility</h3>
        <p className="text-sm">
          You must be a Singapore citizen aged 21 or above, with a household
          income below S$6,000 per month.
        </p>
        <p className="text-sm mt-2 text-lifesg-text-subtle">
          Refer to the policy document for the full criteria.
        </p>
      </PopoverV2>
    ),
    children: <Button variant="outline">Show eligibility</Button>,
  },
};

export const InlineDefault: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-base">
      Your eligibility depends on your{" "}
      <PopoverV2.Inline content="household income" popoverContent="Household income includes wages, dividends, and rental income." />
      {" "}for the past 12 months.
    </p>
  ),
};

export const InlineUnderlineDashed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-base">
      The application closes on{" "}
      <PopoverV2.Inline
        content="31 December"
        underlineStyle="underline-dashed"
        underlineHoverStyle="underline"
        popoverContent="Singapore Standard Time (UTC+8) end of day."
      />
      .
    </p>
  ),
};

export const InlineCustomIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-base">
      Tell us about your{" "}
      <PopoverV2.Inline
        content="dependents"
        icon={<HelpCircle className="size-4" aria-hidden="true" />}
        popoverContent="Dependents are children under 16 or family members you support financially."
      />
      .
    </p>
  ),
};

export const InlineIconOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-base inline-flex items-center gap-1">
      Eligibility
      <PopoverV2.Inline
        icon={<Info className="size-4" aria-hidden="true" />}
        ariaLabel="Eligibility info"
        popoverContent="Open to citizens and permanent residents."
      />
    </p>
  ),
};
