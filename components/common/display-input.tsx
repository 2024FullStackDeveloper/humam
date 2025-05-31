"use client";

import { cn } from "@/lib/utils";

const DisplayInput: React.FC<{label:string,value:string,prefixicon:React.ReactNode}> = ({label,value,prefixicon}) => {
  return (
    <div className="gap-2 flex flex-col">
      <span  className="mb-1 text-sm md:text-lg">
        {label}
      </span>
      <div
        className={cn(
          "flex flex-row border rounded-lg items-center justify-center px-2",
        )}
      >
                <span className="text-extraLight">{prefixicon}</span>

        <div
          className={cn(
            "flex h-10 w-full rounded-md flex-1  bg-transparent px-3 py-2 text-md  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground  focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
            {value}
        </div>
      </div>
    </div>
  );
};

export default DisplayInput;
