"use client";

import { useState } from "react";
import { FeedbackRating } from "@/components/ui/feedback-rating";
import { FeedbackRating as LifeSGFeedbackRating } from "@lifesg/react-design-system/feedback-rating";

const IMG_SRC =
  "https://assets.life.gov.sg/react-design-system/img/feedback-rating/star-default.png";

export function OursPane() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic</code>
        <div className="mt-3 max-w-md">
          <FeedbackRating
            description="How would you rate your experience?"
            buttonLabel="Submit feedback"
            rating={rating}
            onRatingChange={setRating}
            onSubmit={() => setSubmitted(true)}
          />
          {submitted && (
            <p className="mt-3 text-sm text-[var(--lifesg-text-success)]">
              Thanks for your {rating}-star rating.
            </p>
          )}
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with image</code>
        <div className="mt-3 max-w-md">
          <FeedbackRating
            imgSrc={IMG_SRC}
            description="Was this page helpful?"
            buttonLabel="Send"
            rating={rating}
            onRatingChange={setRating}
            onSubmit={() => setSubmitted(true)}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [rating, setRating] = useState(0);
  return (
    <div className="flex flex-col gap-8" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">basic</code>
        <div className="mt-3 max-w-md">
          <LifeSGFeedbackRating
            description="How would you rate your experience?"
            buttonLabel="Submit feedback"
            rating={rating}
            onRatingChange={setRating}
            onSubmit={() => undefined}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with image</code>
        <div className="mt-3 max-w-md">
          <LifeSGFeedbackRating
            imgSrc={IMG_SRC}
            description="Was this page helpful?"
            buttonLabel="Send"
            rating={rating}
            onRatingChange={setRating}
            onSubmit={() => undefined}
          />
        </div>
      </section>
    </div>
  );
}
