import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    label: string;
    error?: string;
  }
>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="gap-2 flex flex-col">
      <Label htmlFor={props?.id} className="mb-1 text-sm md:text-lg">
        {label}
      </Label>
      <div
        className={cn(
          "flex flex-row border rounded-lg items-center justify-center px-2",
          error && "border-failure/90"
        )}
      >
        <textarea
          className={cn(
            "flex  min-h-[250px] w-full rounded-md flex-1  bg-transparent px-3 py-2 text-md  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      <strong>{error}</strong>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
