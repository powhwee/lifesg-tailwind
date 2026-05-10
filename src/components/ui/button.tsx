import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-lg leading-[1.625rem] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:bg-[var(--lifesg-bg-disabled)] disabled:text-[var(--lifesg-text-disabled)] disabled:border-transparent aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "border-primary bg-transparent text-primary hover:bg-primary/10 aria-expanded:bg-primary/10",
        ghost:
          "border border-border bg-transparent text-primary hover:bg-primary/5 aria-expanded:bg-primary/5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline underline-offset-4 hover:underline",
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
