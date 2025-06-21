"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
const DecorationBox = (
    {
        className,
        children,
        headerClassName,
        headerContent,
        contentClassName,
        refreshEnabled = false,
        onRefreshClick
    }:
    React.PropsWithChildren<{
        className?:string,
        headerClassName?:string,
        headerContent?:React.ReactNode,
        contentClassName?:string
        refreshEnabled?:boolean,
        onRefreshClick?: () => Promise<void>
    }>
) => {
  return (
    <div className={cn("border border-secondary/20 rounded-md overflow-hidden shadow-sm",className)}>
      <header className={cn("flex items-center flex-row justify-between bg-secondary/20 h-14 p-5",headerClassName)}>
        {headerContent}
        {refreshEnabled && (
          <Button
            onClick={() => onRefreshClick?.()}
          >
            <RefreshCw/>
          </Button>
        )}
      </header>
      <div className={cn("flex flex-col gap-5 p-5",contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export default DecorationBox;
