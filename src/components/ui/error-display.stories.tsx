import type { Meta, StoryObj } from "@storybook/react";
import { ErrorDisplay } from "./error-display";

const meta: Meta<typeof ErrorDisplay> = {
  title: "Core/ErrorDisplay",
  component: ErrorDisplay,
  argTypes: {
    type: {
      control: "select",
      options: [
        "400", "403", "404", "408", "500", "502", "503", "504",
        "confirmation", "inactivity", "insufficient-credits", "link-error",
        "logout", "warning", "maintenance", "no-item-found",
        "payment-unsuccessful", "transfer-unsuccessful",
        "unsupported-browser", "partially-supported-browser",
      ],
    },
    imageOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

export const NotFound: Story = {
  args: { type: "404" },
};

export const Forbidden: Story = {
  args: { type: "403" },
};

export const ServerError: Story = {
  args: { type: "500" },
};

export const Maintenance: Story = {
  args: {
    type: "maintenance",
    additionalProps: { dateString: "Sun, 28 Jul 2026, 10:00 PM" },
  },
};

export const NoItemFound: Story = {
  args: { type: "no-item-found" },
};

export const Confirmation: Story = {
  args: { type: "confirmation" },
};

export const WithCustomTitle: Story = {
  args: {
    type: "404",
    title: "Custom page-not-found title",
    description: "Per-call overrides take precedence over the built-in copy.",
  },
};

export const WithActionButton: Story = {
  args: {
    type: "404",
    actionButton: { children: "Return to dashboard", onClick: () => alert("returning…") },
  },
};

export const ImageOnly: Story = {
  args: { type: "no-item-found", imageOnly: true },
};

export const FallbackIcon: Story = {
  args: { type: "404", img: null },
};

export const Inactivity: Story = {
  args: {
    type: "inactivity",
    additionalProps: { secondsLeft: 75, reminderInterval: 60 },
    actionButton: { children: "I'm still here" },
  },
};
