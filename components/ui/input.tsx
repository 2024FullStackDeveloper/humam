"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string,
  error?: string,
  prefixicon: React.ReactNode,
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, prefixicon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);


    const getNewType = React.useMemo(() : string=>{
      return showPassword? "text" : "password"
    },[showPassword]);

    return (
      <div className="gap-2 flex flex-col">
        <Label htmlFor={props?.id} className="mb-1 text-sm md:text-lg">{label}</Label>
        <div
          className={cn(
            "flex flex-row border rounded-lg items-center justify-center px-2",
            error && "border-failure/90"
          )}
        >
          <span className="text-extraLight">{prefixicon}</span>
          <input
            type={type == "password" ? getNewType : type }
            className={cn(
              "flex h-10 w-full rounded-md flex-1  bg-transparent px-3 py-2 text-md  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
            ref={ref}
          />
          {type == "password" && <div onClick={()=>{
            setShowPassword(!showPassword);
          }} className="mx-1 cursor-pointer select-none text-extraLight w-5">{!showPassword ? <Eye /> : <EyeOff />}</div>}
        </div>
        <strong>{error}</strong>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
