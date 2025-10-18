import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-graphite-700 selection:bg-feather-600 selection:text-white dark:bg-input/30 border-silver-200 h-9 w-full min-w-0 rounded-md border bg-paper-0 px-3 py-1 text-base shadow-sm transition-all duration-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-feather-500 focus-visible:ring-2 focus-visible:ring-feather-500/50",
        "aria-invalid:ring-danger-500/20 dark:aria-invalid:ring-danger-500/40 aria-invalid:border-danger-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
