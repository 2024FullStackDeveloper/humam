"use client";
import { cn } from "@/lib/utils";
const DecorationBox = (
    {
        className,
        children,
        headerClassName,
        headerContent,
        contentClassName
    }:
    React.PropsWithChildren<{
        className?:string,
        headerClassName?:string,
        headerContent?:React.ReactNode,
        contentClassName?:string
    }>
) => {
  return (
    <div className={cn("border border-secondary/20 rounded-md overflow-hidden shadow-sm",className)}>
      <header className={cn("flex items-center bg-secondary/20 h-10 p-5",headerClassName)}>
        {headerContent}
      </header>
      <div className={cn("flex flex-col gap-5 p-5",contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default DecorationBox;
