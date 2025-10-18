import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-base disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-feather-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-feather-600 to-feather-500 text-white hover:from-feather-500 hover:to-feather-600 hover:shadow-md active:scale-[0.98] shadow-sm transition-brand",
        destructive:
          "bg-danger-500 text-white hover:bg-danger-500/90 focus-visible:ring-danger-500/50 shadow-sm",
        outline:
          "border-2 border-feather-600/20 bg-paper-0 text-feather-600 hover:bg-feather-600 hover:text-white hover:border-feather-600 shadow-sm dark:bg-transparent dark:border-feather-500/30 dark:hover:bg-feather-600",
        secondary:
          "bg-ice-100 text-feather-600 hover:bg-feather-600 hover:text-white shadow-sm",
        ghost:
          "hover:bg-ice-100 hover:text-feather-600 dark:hover:bg-accent",
        link: "text-feather-600 underline-offset-4 hover:underline hover:text-feather-500",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
        "icon-sm": "size-8 rounded-sm",
        "icon-lg": "size-10 rounded-lg",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
