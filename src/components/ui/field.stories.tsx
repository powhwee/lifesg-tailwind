import type { Meta, StoryObj } from "@storybook/react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
} from "./field";

const meta: Meta<typeof Field> = {
  title: "Form/Field",
  component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field name="email" className="w-80">
      <FieldLabel>Email address</FieldLabel>
      <FieldControl
        type="email"
        placeholder="user@example.com"
        className="rounded-input border border-input-border bg-input-bg px-input-padding-x py-2 text-input-size leading-input text-input-text placeholder:text-input-text-placeholder outline-none focus-visible:border-input-border-focus focus-visible:ring-3 focus-visible:ring-input-ring-focus"
      />
    </Field>
  ),
};

export const WithDescription: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field name="username" className="w-80">
      <FieldLabel>Username</FieldLabel>
      <FieldDescription>
        Letters, numbers, and underscores only.
      </FieldDescription>
      <FieldControl
        placeholder="jane_doe"
        className="rounded-input border border-input-border bg-input-bg px-input-padding-x py-2 text-input-size leading-input text-input-text placeholder:text-input-text-placeholder outline-none focus-visible:border-input-border-focus focus-visible:ring-3 focus-visible:ring-input-ring-focus"
      />
    </Field>
  ),
};

export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field name="postcode" invalid className="w-80">
      <FieldLabel>Postal code</FieldLabel>
      <FieldControl
        defaultValue="12"
        aria-invalid="true"
        className="rounded-input border border-input-border-error bg-input-bg px-input-padding-x py-2 text-input-size leading-input text-input-text outline-none ring-3 ring-input-ring-error"
      />
      <FieldError>Postal code must be exactly 6 digits.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field name="locked" disabled className="w-80">
      <FieldLabel>Account ID</FieldLabel>
      <FieldDescription>Hidden when the field is disabled.</FieldDescription>
      <FieldControl
        defaultValue="ACC-00421"
        className="rounded-input border border-input-border bg-input-bg-disabled px-input-padding-x py-2 text-input-size leading-input text-input-text-disabled outline-none"
      />
    </Field>
  ),
};
