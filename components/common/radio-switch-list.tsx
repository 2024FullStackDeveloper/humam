"use client";
import React from "react";
import { Label } from "../ui/label";
import { DropdownType } from "@/lib/types/common-type";
import useLocalizer from "@/lib/hooks/use-localizer";
import { cn } from "@/lib/utils";
const RadioSwitchList = ({
  className,
  label,
  options,
  optionClassName,
  selectedOption,
  disabled = false,
  onChange
}: {
  className?: string,
  label?:string,
  options: Array<DropdownType<string>>,
  optionClassName?:string,
  selectedOption?:string,
  disabled?:boolean,
  onChange?: (selected:string) => void
}) => {
  const { isRtl } = useLocalizer();
  const [selected, setSelected] = React.useState<string | undefined>(selectedOption);
  return (
    <div className="flex flex-col">
      {label && <Label className="mb-4 text-sm md:text-lg">{label}</Label>   }
      <div className={cn("flex flex-row  gap-2",className)}>
      {options.map((option) => (
        <Label
          key={option.id}
          className={cn("flex flex-row items-center justify-center transition-all duration-75 cursor-pointer  space-x-2 bg-primary text-white p-5 rounded-md h-10 min-w-20",
            selected === option.id ? "bg-destructive text-primary shadow-lg" : "bg-primary text-white",
            optionClassName
          )}
        >
          {isRtl ? option.arDesc : option.enDesc}
          <input
            disabled = {disabled}
            type="radio"
            name="options"
            checked={selected === option.id}
            onChange={() => {
              setSelected(option.id);
              onChange && onChange(option.id);
            }}
          />
        </Label>
      ))}
    </div>
    </div>
  );
};

export default RadioSwitchList;
