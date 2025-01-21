"use client";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
export interface ActiveBudgeProps {
  isActive?: boolean;
};
const ActiveBudge = ({ isActive = false }: ActiveBudgeProps) => {
  return (
    <div  className="flex flex-col">
      <div
        className={cn(
          "h-5 w-5 rounded-full text-white flex flex-col items-center justify-center",
          isActive ? "bg-green-600" : "bg-red-600"
        )}
      >
        {isActive ? <Check size={12} /> : <X size={12} />}
      </div>
    </div>
  );
};
export default ActiveBudge;
