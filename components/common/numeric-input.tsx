import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { InputControlType } from "@/lib/types/common-type";
import { NumericFormat, NumericFormatProps } from 'react-number-format';

export interface NumericInputProps extends NumericFormatProps,InputControlType{
  }

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({containerClass ,  className, label, error, prefixicon, decimalScale = 0,fixedDecimalScale= true, ...props },ref) => {
   

    return (
      <div  className={cn("gap-2 flex flex-col",containerClass)}>
        <Label htmlFor={props?.id} className="mb-1">{label}</Label>
        <div
        ref={ref}
          className={cn(
            "border rounded-lg items-center justify-center px-2 flex flex-row",
            error && "border-failure/90"
          )}
        >
          <span className="text-extraLight">{prefixicon}</span>
          <NumericFormat 
            className={cn(
              "flex h-10 w-full rounded-md flex-1  bg-transparent px-3 py-2 text-md  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          fixedDecimalScale = {fixedDecimalScale}
          decimalScale = {decimalScale}
          {...props}
          />;



        </div>
        <strong>{error}</strong>
      </div>
    );
  }
);
NumericInput.displayName = "NumericInput";

export { NumericInput };
