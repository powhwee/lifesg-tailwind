import type { CSSProperties, HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type ContainerType = "flex" | "flex-column" | "grid"

interface CommonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Removes the default 1440px max-width — content stretches edge-to-edge. */
  stretch?: boolean
}

export type SectionProps = CommonProps

export interface ContainerProps extends CommonProps {
  /** Layout mode for direct children. Defaults to "flex" (matches LifeSG). */
  type?: ContainerType
}

export type ContentProps = ContainerProps

/**
 * LifeSG's `ColProps` shape — a number is `span N`, a `[start, end]` tuple is
 * 1-indexed with **exclusive** end (matches LifeSG: `[1, 4]` covers cols 1–3).
 * End-col `-1` means "to last column" (CSS Grid native).
 */
export type ColSpan = number | [number, number | -1] | undefined

export interface ColDivProps extends HTMLAttributes<HTMLDivElement> {
  xxsCols?: ColSpan
  xsCols?: ColSpan
  smCols?: ColSpan
  mdCols?: ColSpan
  lgCols?: ColSpan
  xlCols?: ColSpan
  xxlCols?: ColSpan
}

function Section({ stretch, className, style, children, ...props }: SectionProps) {
  return (
    <section
      data-slot="layout-section"
      className={cn(
        "w-full",
        !stretch && "mx-auto max-w-layout-container-max",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </section>
  )
}

function containerLayoutClasses(type: ContainerType): string {
  switch (type) {
    case "flex":
      return "flex flex-row flex-wrap [gap:var(--layout-grid-gutter)]"
    case "flex-column":
      return "flex flex-col [gap:var(--layout-grid-gutter)]"
    case "grid":
    default:
      return "grid [grid-template-columns:repeat(var(--layout-grid-columns),minmax(0,1fr))] [column-gap:var(--layout-grid-gutter)]"
  }
}

function Container({ type = "flex", stretch, className, style, children, ...props }: ContainerProps) {
  return (
    <div
      data-slot="layout-container"
      data-type={type}
      className={cn(
        "w-full mx-auto [padding-inline:var(--layout-container-pad)]",
        !stretch && "max-w-layout-container-max",
        containerLayoutClasses(type),
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * `Content` is `Container` minus the outer max-width / horizontal padding —
 * intended for nested regions that sit inside a `Container`.
 */
function Content({ type = "flex", stretch, className, style, children, ...props }: ContentProps) {
  return (
    <div
      data-slot="layout-content"
      data-type={type}
      className={cn(
        "w-full",
        !stretch && "max-w-layout-container-max",
        containerLayoutClasses(type),
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

function spanToGridColumn(span: ColSpan): string | undefined {
  if (span == null) return undefined
  if (typeof span === "number") return `span ${span} / span ${span}`
  const [start, end] = span
  if (end === -1) return `${start} / -1`
  /* LifeSG semantics: end is exclusive — `[1, 4]` spans tracks 1..3. */
  return `${start} / ${end}`
}

function ColDiv({
  xxsCols, xsCols, smCols, mdCols, lgCols, xlCols, xxlCols,
  className, style, children, ...props
}: ColDivProps) {
  const cssVars: CSSProperties & Record<string, string | undefined> = {
    "--coldiv-xxs": spanToGridColumn(xxsCols),
    "--coldiv-xs":  spanToGridColumn(xsCols),
    "--coldiv-sm":  spanToGridColumn(smCols),
    "--coldiv-md":  spanToGridColumn(mdCols),
    "--coldiv-lg":  spanToGridColumn(lgCols),
    "--coldiv-xl":  spanToGridColumn(xlCols),
    "--coldiv-xxl": spanToGridColumn(xxlCols),
  }
  /* Drop unset vars so the CSS var() default kicks in. */
  for (const k of Object.keys(cssVars)) if (cssVars[k] === undefined) delete cssVars[k]

  return (
    <div
      data-slot="layout-coldiv"
      className={cn("min-w-0", className)}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export const Layout = { Section, Container, Content, ColDiv }
export { Section, Container, Content, ColDiv }
