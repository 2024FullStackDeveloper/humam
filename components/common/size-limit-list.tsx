"use client";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React from "react";
import usePaginate from "@/lib/hooks/use-paginate";
const SizeLimmitList  : React.FC<{className?:string,limits:Array<number>,placeholder:string}> = ({className,limits,placeholder})=>{
    const {isPaginateEnabled,paginate,changePaginateSize} = usePaginate();
    const [limitSize,setLimitSize] = React.useState<string | undefined>(undefined);


    React.useEffect(()=>{
        if(isPaginateEnabled){
            setLimitSize(paginate?.size?.toString());
        }
    },[isPaginateEnabled,paginate]);

    return (
        <Select value={limitSize} disabled={!isPaginateEnabled} onValueChange={(value)=>{
            changePaginateSize(parseInt(value));
            setLimitSize(value);
        }}>
        <SelectTrigger className={cn("w-[150px]",className)}>
          <SelectValue placeholder={placeholder}/>
        </SelectTrigger>
        <SelectContent>
            {
                limits.map((e)=>(
                    <SelectItem key={`x${e}`} value={e.toString()}>{e}x</SelectItem>
                ))
            }
        </SelectContent>
      </Select>
    )
};

export default SizeLimmitList;