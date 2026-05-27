import type { Meta, StoryObj } from "@storybook/react";
import { BoxContainer } from "./box-container";
import { Button } from "./button";

const meta: Meta<typeof BoxContainer> = {
  title: "Content/BoxContainer",
  component: BoxContainer,
  argTypes: {
    collapsible: { control: "boolean" },
    defaultExpanded: { control: "boolean" },
    clickableHeader: { control: "boolean" },
    displayState: {
      control: "select",
      options: ["default", "error", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BoxContainer>;

const sampleBody = (
  <p className="text-component-body leading-component-body">
    This section can be collapsed by clicking the header. The body content
    stays mounted so internal state survives toggles.
  </p>
);

export const Default: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>{sampleBody}</BoxContainer>
    </div>
  ),
  args: {
    title: "Application details",
    defaultExpanded: true,
  },
};

export const Collapsed: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>{sampleBody}</BoxContainer>
    </div>
  ),
  args: {
    title: "Optional declarations",
    defaultExpanded: false,
  },
};

export const NotCollapsible: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>{sampleBody}</BoxContainer>
    </div>
  ),
  args: {
    title: "Always-visible info",
    collapsible: false,
  },
};

export const WithCallToAction: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer
        {...args}
        callToActionComponent={
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        }
      >
        {sampleBody}
      </BoxContainer>
    </div>
  ),
  args: {
    title: "Contact details",
    defaultExpanded: true,
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>
        <p className="text-component-body leading-component-body">
          Two required fields are missing — expand to complete them before
          submitting.
        </p>
      </BoxContainer>
    </div>
  ),
  args: {
    title: "Employer information",
    displayState: "error",
    defaultExpanded: false,
  },
};

export const WarningState: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>{sampleBody}</BoxContainer>
    </div>
  ),
  args: {
    title: "Documents pending review",
    displayState: "warning",
    defaultExpanded: false,
  },
};

export const HeaderToggleOnly: Story = {
  render: (args) => (
    <div className="w-[28rem]">
      <BoxContainer {...args}>{sampleBody}</BoxContainer>
    </div>
  ),
  args: {
    title: "Click only the chevron to toggle",
    clickableHeader: false,
    defaultExpanded: false,
  },
};
