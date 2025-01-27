"use client";
import Input, {
} from "react-phone-number-input/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import React from "react";

export interface PhoneNumberInputProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  value?: string;
  onValueChange?: (valueChanged?: string) => void;
}

const PhoneNumberInput = React.forwardRef<
  HTMLDivElement,
  PhoneNumberInputProps
>(({ className, label, value, onValueChange, error, ...props }, ref) => {
  const [phoneValue, setPhoneValue] = React.useState<string | undefined>(value);

  return (
    <div className="gap-2 flex flex-col">
      <Label htmlFor={props?.id} className="mb-1 text-sm md:text-lg">
        {label}
      </Label>
      <div
        className={cn(
          "flex flex-row border rounded-lg items-center justify-center px-2",
          error && "border-failure/90",
          props?.disabled && "pointer-events-none"
        )}
      >
        <Input
          className={cn(
            "flex h-10 w-full rounded-md flex-1  bg-transparent px-3 py-2 text-md  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          international
          withCountryCallingCode
          country="SA"
          
          value={phoneValue}
          onChange={(value) => {
            if (onValueChange) {
              onValueChange(value);
            }
            setPhoneValue(value);
          }}
        />
        <span className="text-extraLight">{<Phone />}</span>
      </div>
      <strong>{error}</strong>
    </div>
  );
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
