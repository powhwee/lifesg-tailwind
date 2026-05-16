import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentType, SVGProps } from "react"

import { cn } from "@/lib/utils"

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
    tone: {
      default: "text-icon-color-default",
      subtle:  "text-icon-color-subtle",
      strong:  "text-icon-color-strong",
      primary: "text-icon-color-primary",
      success: "text-icon-color-success",
      warning: "text-icon-color-warning",
      error:   "text-icon-color-error",
      info:    "text-icon-color-info",
      inverse: "text-icon-color-inverse",
    },
  },
  defaultVariants: { size: "md", tone: "default" },
})

type LucideLike = ComponentType<SVGProps<SVGSVGElement>>

interface IconProps
  extends VariantProps<typeof iconVariants>,
    Omit<SVGProps<SVGSVGElement>, "color"> {
  as: LucideLike
}

/**
 * Wraps a Lucide icon component (or any SVG component) with the design-system
 * tone + size tokens. Pass the Lucide icon as `as`:
 *
 *     import { Check } from "lucide-react"
 *     <Icon as={Check} tone="success" size="lg" />
 */
function Icon({ as: SvgComponent, size, tone, className, ...props }: IconProps) {
  return (
    <SvgComponent
      data-slot="icon"
      className={cn(iconVariants({ size, tone }), className)}
      {...props}
    />
  )
}

export { Icon, iconVariants }
