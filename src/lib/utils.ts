import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge about all our custom font-size utilities so it doesn't
// strip them when paired with same-prefix color utilities. e.g.
// `text-field-label` (font-size) and `text-field-text-label` (color) both
// match the `text-*` pattern; without this list, tailwind-merge keeps only
// the last one. Keep in sync with --text-* tokens registered in globals.css
// @theme inline.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-input-size",
        "text-field-label",
        "text-field-description",
        "text-sidenav-label",
        "text-link-list-title-default",
        "text-link-list-title-small",
        "text-link-list-desc-default",
        "text-link-list-desc-small",
        "text-lifesg-font-body-size-baseline",
        "text-lifesg-font-heading-size-md",
        "text-typography-body-bl",
        "text-typography-body-md",
        "text-typography-body-sm",
        "text-typography-body-xs",
        "text-typography-heading-xxl",
        "text-typography-heading-xl",
        "text-typography-heading-lg",
        "text-typography-heading-md",
        "text-typography-heading-sm",
        "text-typography-heading-xs",
        "text-component-header",
        "text-component-header-compact",
        "text-component-body",
        "text-component-body-compact",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
