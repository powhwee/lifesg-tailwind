import type { CSSProperties, HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type DividerLineStyle = "solid" | "dashed"

export interface DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, "color"> {
  /** Thickness in px. Defaults to 1. */
  thickness?: number
  /** Line style. Defaults to "solid". */
  lineStyle?: DividerLineStyle
  /** Line colour (any CSS colour string). Defaults to the divider token. */
  color?: string
}

function Divider({ thickness, lineStyle, color, className, style, ...props }: DividerProps) {
  // Inline style instead of a Tailwind arbitrary-value border-top utility
  // driven by a CSS variable. That syntax produces a generated CSS rule
  // where the unresolved `var(…)` ends up as a parse error under Turbopack
  // and as a warning under `next build`. Driving border-top from `style=`
  // avoids the codegen path entirely.
  const cssVars: Record<string, string> = {
    "--_divider-thickness": thickness != null ? `${thickness}px` : "var(--divider-thickness)",
    "--_divider-color": color ?? "var(--divider-color)",
    "--_divider-style": lineStyle ?? "var(--divider-style)",
  }
  const dividerStyle: CSSProperties = {
    ...cssVars,
    borderTopWidth: "var(--_divider-thickness)",
    borderTopColor: "var(--_divider-color)",
    borderTopStyle: "var(--_divider-style)" as CSSProperties["borderTopStyle"],
    ...style,
  }
  return (
    <hr
      data-slot="divider"
      className={cn("w-full border-0", className)}
      style={dividerStyle}
      {...props}
    />
  )
}

export { Divider }
