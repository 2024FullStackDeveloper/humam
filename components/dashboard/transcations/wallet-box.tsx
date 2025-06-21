"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useLocalizer from "@/lib/hooks/use-localizer";
import { formatSaudiRiyal } from "@/lib/utils/stuff-client";
import { Wallet } from "lucide-react";


export interface WalletBoxProps{
    title:string,
    color?:string,
    balance:number,
    loading:boolean
}

const WalletBox: React.FC<WalletBoxProps> = ({title,color,balance,loading}) => {

  return (
    <div className="flex flex-col rounded-md justify-center gap-4 shadow h-28 w-full p-4 bg-white overflow-hidden">
        {
            loading ? <Skeleton className="h-5 w-20"/> : <span className="lg:text-[16px] text-sm text-primary">{title}</span>
        }
      <div className="flex flex-row items-center gap-4">
        {
            loading ? <Skeleton className="h-10 w-10"/> :    <Wallet color={color} size={32} />
        } 

        {
            loading ? <Skeleton className="h-10 w-24"/> :  <span className="text-primary font-bold text-lg lg:text-xl">
          {formatSaudiRiyal(balance ?? 0)}
        </span>
        }

      </div>
    </div>
  );
};


export default WalletBox;