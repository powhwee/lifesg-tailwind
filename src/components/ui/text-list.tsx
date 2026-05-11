import type { CSSProperties, HTMLAttributes, ReactNode } from "react"
import { Children } from "react"

import { cn } from "@/lib/utils"

export type TextListSize = "bl" | "md" | "sm" | "xs"
export type BulletType = "disc" | "circle" | "square" | "none"
export type CounterType = "lower-alpha" | "decimal" | "lower-roman"

interface BaseProps {
  children: ReactNode
  size?: TextListSize
  bottomMargin?: number
}

export type UnorderedListProps = BaseProps &
  Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
    /** "disc" | "circle" | "square" | "none", or a custom React node used as bullet. */
    bulletType?: BulletType | ReactNode
  }

export type OrderedListProps = BaseProps &
  Omit<HTMLAttributes<HTMLOListElement>, "children"> & {
    counterType?: CounterType
    counterSeparator?: string
    reversed?: boolean
    start?: number
  }

function sizeVars(size: TextListSize): CSSProperties & Record<string, string> {
  return {
    "--_list-size": `var(--typography-body-${size}-size)`,
    "--_list-lh":   `var(--typography-body-${size}-lh)`,
    "--_list-ls":   `var(--typography-body-${size}-ls)`,
  }
}

function mbStyle(bottomMargin: number | undefined): CSSProperties | undefined {
  return bottomMargin != null ? { marginBottom: `${bottomMargin}px` } : undefined
}

function isPlainBullet(v: unknown): v is BulletType {
  return v === "disc" || v === "circle" || v === "square" || v === "none"
}

const baseListCx =
  "text-[length:var(--_list-size)] leading-[var(--_list-lh)] tracking-[var(--_list-ls)] " +
  "[font-family:var(--typography-font-family)]"

function UnorderedList({
  children,
  size = "md",
  bottomMargin,
  bulletType = "disc",
  className,
  style,
  ...props
}: UnorderedListProps) {
  const styleBase = { ...sizeVars(size), ...mbStyle(bottomMargin), ...style }
  const items = Children.toArray(children)

  if (isPlainBullet(bulletType)) {
    const listStyle =
      bulletType === "none"
        ? { listStyle: "none" as const, paddingInlineStart: 0 }
        : { listStyleType: bulletType, paddingInlineStart: "2.5rem" }
    return (
      <ul
        data-slot="unordered-list"
        className={cn(baseListCx, className)}
        style={{ ...styleBase, ...listStyle }}
        {...props}
      >
        {items.map((child, i) => <li key={i}>{child}</li>)}
      </ul>
    )
  }

  return (
    <ul
      data-slot="unordered-list"
      className={cn(baseListCx, "list-none ps-0", className)}
      style={styleBase}
      {...props}
    >
      {items.map((child, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="shrink-0 inline-flex" aria-hidden>{bulletType}</span>
          <span className="min-w-0 flex-1">{child}</span>
        </li>
      ))}
    </ul>
  )
}

const ROMAN: [number, string][] = [
  [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"],
  [100, "c"], [90, "xc"], [50, "l"], [40, "xl"],
  [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
]

function toRoman(n: number): string {
  if (n <= 0) return String(n)
  let out = ""
  for (const [v, s] of ROMAN) {
    while (n >= v) { out += s; n -= v }
  }
  return out
}

function counterLabel(n: number, type: CounterType): string {
  if (type === "decimal") return String(n)
  if (type === "lower-roman") return toRoman(n)
  /* lower-alpha: 1 → "a", 26 → "z", 27 → "aa" */
  if (n <= 0) return String(n)
  let out = ""
  let x = n
  while (x > 0) {
    const r = (x - 1) % 26
    out = String.fromCharCode(97 + r) + out
    x = Math.floor((x - 1) / 26)
  }
  return out
}

function OrderedList({
  children,
  size = "md",
  bottomMargin,
  counterType = "decimal",
  counterSeparator = ")",
  reversed,
  start,
  className,
  style,
  ...props
}: OrderedListProps) {
  const styleBase = { ...sizeVars(size), ...mbStyle(bottomMargin), ...style }
  const items = Children.toArray(children)
  const count = items.length

  /* Always render manually so counter + separator can be a custom suffix
   * (native list-style-type only supports a "." suffix). Counter is positioned
   * absolutely to the LEFT of the li's content box — mirrors native list-item
   * layout where markers sit outside the content area, so content starts at
   * the list's padded left edge (matching LifeSG visually). */
  return (
    <ol
      data-slot="ordered-list"
      className={cn(baseListCx, "list-none ps-12", className)}
      style={styleBase}
      reversed={reversed}
      start={start}
      {...props}
    >
      {items.map((child, i) => {
        const n = reversed ? (start ?? count) - i : (start ?? 1) + i
        return (
          <li key={i} className="relative">
            <span
              className="absolute end-full pe-3 tabular-nums text-right"
              aria-hidden
            >
              {counterLabel(n, counterType)}{counterSeparator}
            </span>
            {child}
          </li>
        )
      })}
    </ol>
  )
}

export { UnorderedList, OrderedList }
