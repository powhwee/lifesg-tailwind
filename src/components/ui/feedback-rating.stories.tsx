import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FeedbackRating } from "./feedback-rating";

const meta: Meta<typeof FeedbackRating> = {
  title: "Selection and input/FeedbackRating",
  component: FeedbackRating,
};

export default meta;
type Story = StoryObj<typeof FeedbackRating>;

function ControlledRating({
  initial = 0,
  ...rest
}: Omit<
  React.ComponentProps<typeof FeedbackRating>,
  "rating" | "onRatingChange" | "onSubmit"
> & { initial?: number }) {
  const [rating, setRating] = React.useState(initial);
  const [submitted, setSubmitted] = React.useState<number | null>(null);
  return (
    <div className="w-full max-w-2xl">
      <FeedbackRating
        {...rest}
        rating={rating}
        onRatingChange={setRating}
        onSubmit={() => setSubmitted(rating)}
      />
      {submitted !== null && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Submitted: {submitted} star{submitted === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledRating />,
};

export const WithDescription: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRating description="How was your experience with this service today?" />
  ),
};

export const PreFilled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRating
      initial={4}
      description="Thanks for rating! You can change your selection."
    />
  ),
};

export const CustomButtonLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlledRating
      description="Rate this article"
      buttonLabel="Send feedback"
    />
  ),
};
