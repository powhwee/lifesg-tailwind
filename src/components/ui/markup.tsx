import type { HTMLAttributes, CSSProperties } from "react"

import { cn } from "@/lib/utils"

export type MarkupBaseSize = "bl" | "md" | "sm" | "xs"

export interface MarkupProps extends HTMLAttributes<HTMLDivElement> {
  /** Default text size for child content. */
  baseTextSize?: MarkupBaseSize
  /** Default text colour for child content. Any CSS colour string. */
  baseTextColor?: string
  /** Render as inline `<span>` instead of block `<div>`. */
  inline?: boolean
}

/**
 * Renders CMS-authored HTML with consistent design-system typography.
 * Mirrors LifeSG's `<Markup>` shape: tag-level styles flow from the
 * typography scale, but consumers can override the baseline via props.
 */
function Markup({
  baseTextSize,
  baseTextColor,
  inline = false,
  className,
  style,
  ...props
}: MarkupProps) {
  /* When baseTextSize is omitted, leave typography to inherit from the parent
   * (matches LifeSG: their Markup only applies typography when explicitly told
   * to). Only set the vars when the consumer passes baseTextSize. */
  const cssVars: CSSProperties & Record<string, string> = {}
  if (baseTextSize) {
    cssVars["--_markup-text-size"] = `var(--typography-body-${baseTextSize}-size)`
    cssVars["--_markup-text-lh"]   = `var(--typography-body-${baseTextSize}-lh)`
    cssVars["--_markup-text-ls"]   = `var(--typography-body-${baseTextSize}-ls)`
  }
  if (baseTextColor) {
    cssVars["--_markup-text-color"] = baseTextColor
  }
  const Tag = inline ? "span" : "div"
  return (
    <Tag
      data-slot="markup"
      className={cn("markup-root", inline ? "inline" : "block", className)}
      style={{ ...cssVars, ...style }}
      {...props}
    />
  )
}

export { Markup }
