import { cva, type VariantProps } from "class-variance-authority"
import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react"

import { cn } from "@/lib/utils"

const typographyVariants = cva("[font-family:var(--typography-font-family)]", {
  variants: {
    variant: {
      "heading-xxl":
        "text-typography-heading-xxl leading-typography-heading-xxl tracking-typography-heading-xxl",
      "heading-xl":
        "text-typography-heading-xl leading-typography-heading-xl tracking-typography-heading-xl",
      "heading-lg":
        "text-typography-heading-lg leading-typography-heading-lg tracking-typography-heading-lg",
      "heading-md":
        "text-typography-heading-md leading-typography-heading-md tracking-typography-heading-md",
      "heading-sm":
        "text-typography-heading-sm leading-typography-heading-sm tracking-typography-heading-sm",
      "heading-xs":
        "text-typography-heading-xs leading-typography-heading-xs tracking-typography-heading-xs",
      "body-bl":
        "text-typography-body-bl leading-typography-body-bl tracking-typography-body-bl",
      "body-md":
        "text-typography-body-md leading-typography-body-md tracking-typography-body-md",
      "body-sm":
        "text-typography-body-sm leading-typography-body-sm tracking-typography-body-sm",
      "body-xs":
        "text-typography-body-xs leading-typography-body-xs tracking-typography-body-xs",
    },
    weight: {
      light:    "[font-weight:var(--typography-weight-light)]",
      regular:  "[font-weight:var(--typography-weight-regular)]",
      semibold: "[font-weight:var(--typography-weight-semibold)]",
      bold:     "[font-weight:var(--typography-weight-bold)]",
    },
    inline: { true: "inline", false: "block" },
  },
})

type DefaultElementMap = Record<NonNullable<VariantProps<typeof typographyVariants>["variant"]>, ElementType>

const defaultElement: DefaultElementMap = {
  "heading-xxl": "h1", "heading-xl": "h1", "heading-lg": "h2",
  "heading-md": "h3",  "heading-sm": "h4", "heading-xs": "h5",
  "body-bl": "p", "body-md": "p", "body-sm": "p", "body-xs": "p",
}

type TypographyOwnProps<E extends ElementType> = {
  as?: E
  paragraph?: boolean
  maxLines?: number
} & VariantProps<typeof typographyVariants>

type TypographyProps<E extends ElementType = "p"> = TypographyOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TypographyOwnProps<E> | "color">

function Typography<E extends ElementType = "p">({
  as,
  variant = "body-md",
  weight,
  inline,
  paragraph,
  maxLines,
  className,
  style,
  ...props
}: TypographyProps<E>) {
  const tag = (as ?? defaultElement[variant ?? "body-md"]) as ElementType
  const lineClampStyle = maxLines
    ? { display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }
    : undefined
  return createElement(tag, {
    "data-slot": "typography",
    className: cn(
      typographyVariants({ variant, weight, inline }),
      paragraph && "mb-4",
      className
    ),
    style: lineClampStyle ? { ...lineClampStyle, ...style } : style,
    ...props,
  })
}

export { Typography, typographyVariants }
