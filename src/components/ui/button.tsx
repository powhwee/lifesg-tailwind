import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-lg leading-[1.625rem] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-[var(--button-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--button-ring-focus)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:bg-[var(--button-bg-disabled)] disabled:text-[var(--button-text-disabled)] disabled:border-[var(--button-border-disabled)] aria-invalid:border-[var(--button-border-invalid)] aria-invalid:ring-3 aria-invalid:ring-[var(--button-ring-invalid)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-bg-default)] text-[var(--button-text-default)] hover:bg-[var(--button-bg-default-hover)]",
        outline:
          "border-[var(--button-border-outline)] bg-[var(--button-bg-outline)] text-[var(--button-text-outline)] hover:bg-[var(--button-bg-outline-hover)] hover:text-[var(--button-text-outline-hover)] aria-expanded:bg-[var(--button-bg-outline-hover)] aria-expanded:text-[var(--button-text-outline-hover)]",
        secondary:
          "border-[var(--button-border-secondary)] bg-[var(--button-bg-secondary)] text-[var(--button-text-secondary)] hover:bg-[var(--button-bg-secondary-hover)] aria-expanded:bg-[var(--button-bg-secondary-hover)]",
        ghost:
          "border border-[var(--button-border-ghost)] bg-[var(--button-bg-ghost)] text-[var(--button-text-ghost)] hover:bg-[var(--button-bg-ghost-hover)] aria-expanded:bg-[var(--button-bg-ghost-hover)]",
        destructive:
          "bg-[var(--button-bg-destructive)] text-[var(--button-text-destructive)] hover:bg-[var(--button-bg-destructive-hover)] focus-visible:border-[var(--button-border-destructive-focus)] focus-visible:ring-[var(--button-ring-destructive-focus)]",
        link: "text-[var(--button-text-link)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-4",
        xs: "h-8 gap-1 rounded px-2 text-sm",
        sm: "h-10 gap-1.5 rounded px-3 text-sm",
        lg: "h-14 gap-2 rounded-md px-6 text-base",
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
