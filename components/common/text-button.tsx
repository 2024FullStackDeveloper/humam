"use client";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const textButtonVariants = cva(
  "inline-flex cursor-pointer whitespace-nowrap select-none bg-transparent text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary/80",
        destructive:
          "text-destructive-foreground hover:text-destructive-foreground/80",
        secondary: "text-secondary hover:text-secondary/80",
        ghost: "hover:text-accent hover:text-accent-foreground/80",
        white: "text-white  hover:text-white/80",
        primaryOutline:"min-w-[120px] bg-primary/20 border border-primary text-primary font-semibold hover:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textButtonVariants> {
}
const TextButton = React.forwardRef<HTMLDivElement, TextButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        className={cn(textButtonVariants({ variant, className }))}
        {...props}
        ref={ref}
      >
        {props?.children}
      </div>
    );
  }
);

TextButton.displayName = "TextButton";
export default TextButton;
