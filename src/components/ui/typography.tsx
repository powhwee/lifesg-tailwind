import { cva, type VariantProps } from "class-variance-authority"
import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react"

import { cn } from "@/lib/utils"

const typographyVariants = cva("[font-family:var(--typography-font-family)]", {
  variants: {
    variant: {
      "heading-xxl":
        "text-[length:var(--typography-heading-xxl-size)] leading-[var(--typography-heading-xxl-lh)] tracking-[var(--typography-heading-xxl-ls)]",
      "heading-xl":
        "text-[length:var(--typography-heading-xl-size)] leading-[var(--typography-heading-xl-lh)] tracking-[var(--typography-heading-xl-ls)]",
      "heading-lg":
        "text-[length:var(--typography-heading-lg-size)] leading-[var(--typography-heading-lg-lh)] tracking-[var(--typography-heading-lg-ls)]",
      "heading-md":
        "text-[length:var(--typography-heading-md-size)] leading-[var(--typography-heading-md-lh)] tracking-[var(--typography-heading-md-ls)]",
      "heading-sm":
        "text-[length:var(--typography-heading-sm-size)] leading-[var(--typography-heading-sm-lh)] tracking-[var(--typography-heading-sm-ls)]",
      "heading-xs":
        "text-[length:var(--typography-heading-xs-size)] leading-[var(--typography-heading-xs-lh)] tracking-[var(--typography-heading-xs-ls)]",
      "body-bl":
        "text-[length:var(--typography-body-bl-size)] leading-[var(--typography-body-bl-lh)] tracking-[var(--typography-body-bl-ls)]",
      "body-md":
        "text-[length:var(--typography-body-md-size)] leading-[var(--typography-body-md-lh)] tracking-[var(--typography-body-md-ls)]",
      "body-sm":
        "text-[length:var(--typography-body-sm-size)] leading-[var(--typography-body-sm-lh)] tracking-[var(--typography-body-sm-ls)]",
      "body-xs":
        "text-[length:var(--typography-body-xs-size)] leading-[var(--typography-body-xs-lh)] tracking-[var(--typography-body-xs-ls)]",
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
