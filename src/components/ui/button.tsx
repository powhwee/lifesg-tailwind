import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-lg leading-button font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-button-border-focus focus-visible:ring-3 focus-visible:ring-button-ring-focus active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:bg-button-bg-disabled disabled:text-button-text-disabled disabled:border-button-border-disabled aria-invalid:border-button-border-invalid aria-invalid:ring-3 aria-invalid:ring-button-ring-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-button-bg-default text-button-text-default hover:bg-button-bg-default-hover",
        outline:
          "border-button-border-outline bg-button-bg-outline text-button-text-outline hover:bg-button-bg-outline-hover hover:text-button-text-outline-hover aria-expanded:bg-button-bg-outline-hover aria-expanded:text-button-text-outline-hover",
        secondary:
          "border-button-border-secondary bg-button-bg-secondary text-button-text-secondary hover:bg-button-bg-secondary-hover aria-expanded:bg-button-bg-secondary-hover",
        ghost:
          "border border-button-border-ghost bg-button-bg-ghost text-button-text-ghost hover:bg-button-bg-ghost-hover aria-expanded:bg-button-bg-ghost-hover",
        destructive:
          "bg-button-bg-destructive text-button-text-destructive hover:bg-button-bg-destructive-hover focus-visible:border-button-border-destructive-focus focus-visible:ring-button-ring-destructive-focus",
        link: "text-button-text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-4",
        xs: "h-8 gap-1 rounded px-2 text-sm",
        sm: "h-10 gap-1.5 rounded px-3 text-sm",
        lg: "h-16 gap-2 rounded-md px-8 text-xl",
        icon: "size-12",
        "icon-xs": "size-8 rounded",
        "icon-sm": "size-10 rounded",
        "icon-lg": "size-14 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
