"use client";
import { ArrowDownUp, ArrowUpDown } from "lucide-react";
import TextButton from "./text-button";

export interface SortButtonProps{
isAcs?:boolean,
label:string,
onSort?:()=>void
};

const SortButton = ({isAcs,label,...props}:SortButtonProps)=>{
    return (
        <div className="flex flex-row gap-2">
        <TextButton
          variant="secondary"
          onClick={props?.onSort}
        >
          {isAcs ? (
            <ArrowUpDown className=" h-4 w-4" />
          ) : (
            <ArrowDownUp className=" h-4 w-4" />
          )}
        </TextButton>
          {label}
      </div>
    )
};
export default SortButton;