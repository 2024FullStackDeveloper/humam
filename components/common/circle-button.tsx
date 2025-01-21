"use client";
import React from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import useLocalizer from "@/lib/hooks/use-localizer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CircleButtonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof buttonVariants>{
 icon?:React.JSX.Element,
 type?:"back" | "other"
};


const CircleButton = React.forwardRef<HTMLDivElement,CircleButtonProps>(
    ({ className, variant = "destructive", icon,type = "back",...props }, ref) =>{

        if(type == "other" && !icon)
            throw new Error("It must pass icon element into CircleButton.");

        const {isRtl} = useLocalizer();

        const renderIcon = React.useMemo(() : React.JSX.Element=>{   
          if(type == "back"){
            return isRtl ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>
          }    
          return type == "other" ?  icon! : <></> ;
        },[]);

        return (
            <div 
            ref={ref} 
            className={cn('!rounded-full  cursor-pointer',buttonVariants({ variant, className }))}
            {...props}
            >
              {renderIcon}
            </div>
        );
    }
);

CircleButton.displayName = "CircleButton";
export default CircleButton;