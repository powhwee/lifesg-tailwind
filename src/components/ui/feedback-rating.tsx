"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeedbackRatingProps {
  imgSrc?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
  id?: string;
  rating: number;
  onRatingChange: (value: number) => void;
  onSubmit: () => void;
}

function FeedbackRating({
  imgSrc,
  description,
  buttonLabel = "Submit",
  className,
  id,
  rating,
  onRatingChange,
  onSubmit,
}: FeedbackRatingProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col items-center gap-4 py-4",
        className
      )}
    >
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt="" className="h-24 w-auto object-contain" />
      )}

      {description && (
        <p className="text-center text-lg font-semibold text-feedback-rating-text">{description}</p>
      )}

      <div role="radiogroup" aria-label="Rating" className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= rating;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === rating}
              onClick={() => onRatingChange(value)}
              className={cn(
                "rounded-full p-1 transition-colors outline-none cursor-pointer",
                "text-feedback-rating-star",
                isActive && "text-feedback-rating-star-active",
                "hover:text-feedback-rating-star-hover",
                "focus-visible:ring-3 focus-visible:ring-feedback-rating-ring-focus"
              )}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
            >
              <Star
                className="size-10"
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      <Button onClick={onSubmit} disabled={rating === 0} className="w-full">{buttonLabel}</Button>
    </div>
  );
}

export { FeedbackRating };
