"use client";
"use client";

import { cn } from "@/lib/utils";

export interface SingleRowProps{
icon:React.ReactNode,
label:string,
value?:string | React.ReactNode,
title?:string | null,
mode?:"col" | "row"
};
const SingleRow = ({
icon,
label,
value,
title,
mode = "row"
}:SingleRowProps) => {
  return (
    <div className={cn(mode == "row" ? "flex-row justify-between items-center" : "flex-col"," flex  gap-2 w-full")}>
      <div className="gap-2 flex flex-row  items-center">
          {icon}
        <span  className="text-sm md:text-[16px] text-primary/90 font-bold">
            {label}
        </span>
      </div>
      <div className="text-sm text-primary  font-semibold" title={title ?? ''}>
        {value}
      </div>
    </div>
  );
};
export default SingleRow;
