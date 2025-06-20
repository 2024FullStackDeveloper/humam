import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
         successOutline:"bg-success/20 border border-success text-primary font-semibold hover:bg-success/10",
        warningOutline:"bg-warning/10 text-pending font-semibold border border-pending/30 hover:bg-warning/5",
        dangerOutline:"bg-danger/10 text-danger font-semibold border border-danger/30 hover:bg-danger/5",
        idleOutline:"bg-idle/10 text-idle font-semibold border border-idle/30 hover:bg-idle/5",
        infoOutline:"bg-info/10 text-info font-semibold border border-info/30 hover:bg-info/5",
        danger:"bg-danger text-white"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
