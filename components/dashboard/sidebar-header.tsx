"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";


export interface SidebarHeaderProps{
    className?:string,
    userName:string,
    logInDate?:string | null,
    logOutDate?:string | null
};



const SidebarHeader = ({className}:SidebarHeaderProps)=>{

return (
    <div
    className={cn(
      "gap-2 select-none flex relative flex-row items-center justify-center w-full h-[96px]  border-b border-b-light p-4",className
    )}
  >

    <Image
      alt="logo"
      height={64}
      width={64}
      src="/assets/logo.svg"
      className="order-2"
      priority
    />
    <div className="flex flex-col gap-1 order-1">
    {/* <p className="font-bold text-destructive text-sm truncate max-w">
        {userName}
    </p> */}
    {/* {
    (logInDate && Date.parse(logInDate) != 0) && <div className="flex flex-row items-center gap-2">
        <LogIn size={14} color="white"/>
        <span className="text-white text-[12px]"><bdi>{dateFormat(logInDate,"dd/mm/yyyy hh:MM TT")}</bdi></span>
    </div>
    }
    {
    (logOutDate && Date.parse(logOutDate) != 0) && <div className="flex flex-row items-center gap-2">
        <LogOut size={14} color="white"/>
        <span className="text-white text-[12px]"><bdi>{dateFormat(logOutDate,"dd/mm/yyyy hh:MM TT")}</bdi></span>
    </div>
    } */}
    </div>

  </div>
)
};
export default SidebarHeader;