import type { Meta, StoryObj } from "@storybook/react";
import { Markup } from "./markup";

const meta: Meta<typeof Markup> = {
  title: "Core/Markup",
  component: Markup,
  argTypes: {
    baseTextSize: {
      control: "select",
      options: [undefined, "bl", "md", "sm", "xs"],
    },
    baseTextColor: { control: "color" },
    inline: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Markup>;

const sampleHtml = `
  <h2>Apply online</h2>
  <p>Most applications can be completed online. Sign in with <strong>Singpass</strong> to get started.</p>
  <ul>
    <li>Prepare your supporting documents</li>
    <li>Complete the form (about 10 minutes)</li>
    <li>Submit and track progress in your dashboard</li>
  </ul>
  <p>If you need help, visit any <a href="#">ServiceSG Centre</a> or call the helpline.</p>
`;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-prose">
      <Markup {...args} dangerouslySetInnerHTML={{ __html: sampleHtml }} />
    </div>
  ),
};

export const WithBaseTextSize: Story = {
  render: (args) => (
    <div className="max-w-prose">
      <Markup {...args} dangerouslySetInnerHTML={{ __html: sampleHtml }} />
    </div>
  ),
  args: {
    baseTextSize: "sm",
  },
};

export const WithBaseTextColor: Story = {
  render: (args) => (
    <div className="max-w-prose">
      <Markup {...args} dangerouslySetInnerHTML={{ __html: sampleHtml }} />
    </div>
  ),
  args: {
    baseTextColor: "#3C91EC",
  },
};

export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="max-w-prose">
      The form supports{" "}
      <Markup inline dangerouslySetInnerHTML={{ __html: "<em>rich formatting</em>" }} />
      {" "}— including <strong>bold</strong> and links — while staying on the same line.
    </p>
  ),
};
