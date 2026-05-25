import type { Meta, StoryObj } from "@storybook/react";
import { Tab } from "./tab";

const meta: Meta<typeof Tab> = {
  title: "Content/Tab",
  component: Tab,
  argTypes: {
    initialActive: {
      control: "number",
    },
    fullWidthIndicatorLine: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  render: (args) => (
    <Tab {...args}>
      <Tab.Item title="Account Profile">
        <div className="p-4 bg-lifesg-bg-hover rounded border border-border">
          <h4 className="font-bold mb-2">User Profile Information</h4>
          <p className="text-sm text-muted-foreground">Manage your account profile settings and contact details.</p>
        </div>
      </Tab.Item>
      <Tab.Item title="Applications">
        <div className="p-4 bg-lifesg-bg-hover rounded border border-border">
          <h4 className="font-bold mb-2">Active Applications</h4>
          <p className="text-sm text-muted-foreground">You currently have no active government service applications.</p>
        </div>
      </Tab.Item>
      <Tab.Item title="Inbox Messages">
        <div className="p-4 bg-lifesg-bg-hover rounded border border-border">
          <h4 className="font-bold mb-2">Your Notifications</h4>
          <p className="text-sm text-muted-foreground">Inbox is empty. We will notify you when new messages arrive.</p>
        </div>
      </Tab.Item>
    </Tab>
  ),
  args: {
    initialActive: 0,
    fullWidthIndicatorLine: true,
  },
};
