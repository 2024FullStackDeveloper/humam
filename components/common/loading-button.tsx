"use client";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { VariantButtomType } from "@/lib/types/common-type";

export interface LoadingButtonProps{
className?:string,
variant?:VariantButtomType,
label:string,
disabled?:boolean,
loading?:boolean,
onClick?:()=>void
};

const LoadingButton = (
{className , label  , variant = "default" , disabled = false , ...props}:LoadingButtonProps
)=>{
    return <Button onClick={()=>{
        if(props?.onClick){
            props?.onClick()
        }
    }}  disabled={props?.loading || disabled} className={cn("gap-2",className)} variant={variant}>{label}
     {props?.loading && <LoaderCircle className="animate-spin" />}
    </Button>
};
export default LoadingButton;