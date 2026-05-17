import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge about our custom font-size utilities so it doesn't
// strip `text-input-size` as a "text-*" color when paired with another
// text-* class like `text-input-text` (the input text color).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-input-size"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
