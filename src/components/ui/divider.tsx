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
  const cssVars: CSSProperties & Record<string, string> = {
    "--_divider-thickness": thickness != null ? `${thickness}px` : "var(--divider-thickness)",
    "--_divider-color": color ?? "var(--divider-color)",
    "--_divider-style": lineStyle ?? "var(--divider-style)",
  }
  return (
    <hr
      data-slot="divider"
      className={cn(
        "w-full border-0 border-t-[length:var(--_divider-thickness)]",
        "border-t-[color:var(--_divider-color)] [border-top-style:var(--_divider-style)]",
        className
      )}
      style={{ ...cssVars, ...style }}
      {...props}
    />
  )
}

export { Divider }
