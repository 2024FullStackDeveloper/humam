"use client";

import NoDataBox from "@/components/common/no-data-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLocalizer from "@/lib/hooks/use-localizer";
import ApiAction from "@/lib/server/action";
import {
  APICollectionResponseType,
  APIProviderServiceResponseType,
  APIServiceDetailsResponseType,
  APISubServiceResponseType,
} from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";
import React, { useTransition } from "react";

export interface ToggleServicesProps {
  subServices?: Array<APISubServiceResponseType> | null;
  serviceDetailsIds?: Array<number> | null;
  providerServices?:APIProviderServiceResponseType | null
}

const ToggleServices = ({ subServices, serviceDetailsIds , providerServices }: ToggleServicesProps) => {
  const { isRtl } = useLocalizer();
  const values = React.useDeferredValue(subServices);
  const [active, setActive] = React.useState<number | null>(null);
  const [serviceDetails, setServiceDetails] = React.useState<
    Array<APIServiceDetailsResponseType> | null | undefined
  >([]);
  const [isPending, startTransition] = useTransition();
  const isServiceDetailsLocked = React.useCallback((serviceId:number)=>{
    return providerServices?.servicesDetails?.find(e=>e.serviceId == serviceId)?.stopEnabled ?? false;
  },[providerServices]);

  
  if (!values || values?.length === 0) {
    return (
      <div className="flex justify-center items-center  mt-4">
        <NoDataBox />
      </div>
    );
  }




  const handleChangeSubs = (id: number) => {
    startTransition(async () => {
      setServiceDetails([]);
      const response = await ApiAction<
        APICollectionResponseType<APIServiceDetailsResponseType>
      >({
        controller: "services",
        url: `${id}/service_details`,
        method: "GET",
        revalidate: 10,
      });

      if (response?.result?.code == 0) {
        if(serviceDetailsIds && serviceDetailsIds?.length > 0){
          const filtered = response?.result.data?.resultSet?.filter((item) =>
            serviceDetailsIds?.includes(item.id)
          );
          setServiceDetails(filtered);
        }
      }
    });
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col gap-2 mt-4">
      <div className="flex flex-row gap-4 flex-wrap items-center">
        {values &&
          values?.map((item,index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild onClick={() => setActive(item?.id)}>
                  <div
                    onClick={() => handleChangeSubs(item?.id)}
                    className={cn(
                      "bg-secondary/10 p-2 rounded-md w-[160px] h-[160px] flex flex-col gap-2 items-center justify-evenly shadow-md cursor-pointer",
                      active === item?.id ? "border-2 border-primary" : ""
                    )}
                  >
                    <Avatar>
                      <AvatarImage
                        src={item?.subServiceImg ?? ""}
                        alt={isRtl ? item?.arDesc : item?.enDesc}
                      />
                      <AvatarFallback>
                        {isRtl ? item?.arDesc : item?.enDesc}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-primary text-center">
                      {isRtl ? item?.arDesc : item?.enDesc}
                    </span>
                     {item.stopEnabled ? <Lock/> : <Unlock/>}
                  </div>
                </TooltipTrigger>
                <TooltipContent align="start" side="left">
                  <p className="text-primary">
                    {isRtl ? item?.arDetails : item?.enDetails}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
      <Separator className="my-2" />
      <div className="flex flex-row gap-2 items-center">
        {isPending &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="bg-secondary/10 w-[80px] h-[20px] rounded-full"
            />
          ))}
      </div>
      {!isPending && (
        <div className="flex flex-row gap-2 flex-wrap items-center">
          {serviceDetails &&
            serviceDetails?.length > 0 &&
            serviceDetails?.map((item) => (
              <Badge variant={isServiceDetailsLocked(item.id) ? "danger" : "secondary"} key={item.id} className="flex flex-row gap-2">
                {isRtl ? item.arDesc : item?.enDesc}
                {isServiceDetailsLocked(item.id) ? <Lock size={14}/> : <Unlock size={14}/>}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};
export default ToggleServices;
