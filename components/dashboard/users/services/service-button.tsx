"use client";
import NoDataBox from "@/components/common/no-data-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useLocalizer from "@/lib/hooks/use-localizer";
import {
  APIProviderServiceItemBaseeRsponseType,
  APIServiceInfoResponseType,
  APIServiceItemResponseType,
  APISubServiceItemResponseType,
} from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { useToggle } from "@uidotdev/usehooks";
import { Lock, Unlock } from "lucide-react";
import React from "react";

export interface ServiceContainerProps {
  dlgTitle: string;
  data: APIServiceInfoResponseType;
  activeMainServices?: Array<APIProviderServiceItemBaseeRsponseType> | null;
  activeSubServices?: Array<APIProviderServiceItemBaseeRsponseType> | null;
  existingServices?: Array<{level:number,id:number,stopEnabled:boolean}> | null;
  onChange?: (level: number, values: APIProviderServiceItemBaseeRsponseType[]) => void;
  editable?: boolean;
  onToggleStopped?:(value:{level:number,id:number,stopEnabled:boolean})=>void
}

const ServiceContainerButton = ({
  dlgTitle,
  data,
  ...props
}: ServiceContainerProps) => {
  // const { isRtl } = useLocalizer();
  const [on, toggle] = useToggle(false);
  // const [details, setDetails] = React.useState<
  //   Array<APIServiceItemResponseType> | null | undefined
  // >([]);

  // const handlePopulateDetails = (item: APISubServiceItemResponseType) => {
  //   setDetails(item?.serviceDetailsList);
  // };

  // const {t} = useLocalizer();

  // React.useEffect(()=>{
  //   if(on){
  //     setDetails([]);
  //   }
  // },[on]);


  const [existingServices,setExistingServices] = React.useState<Array<{level:number,id:number,stopEnabled:boolean}> | null | undefined>(props?.existingServices);

 React.useLayoutEffect(()=>{
  setExistingServices(props?.existingServices)
  },[props?.existingServices])

  const activeMainServicesValues  = React.useMemo(() => { 
    return props?.activeMainServices?.map((item) => item.serviceId) ?? [];
  },[props?.activeMainServices]);


  const activeSubServicesValues  = React.useMemo(() => { 
    return props?.activeSubServices?.map((item) => item.serviceId) ?? [];
  },[props?.activeSubServices]);



  // const activeServicesDetailsValues  = React.useMemo(() => { 
  //   return props?.activeServicesDetails?.map((item) => item.serviceId) ?? [];
  // },[props?.activeServicesDetails]);


  return (
    <>
      <ServiceButton {...data} onClick={toggle}  
      checked={activeMainServicesValues?.includes(data.id) ?? false}
      stopped={existingServices?.find((item) => item?.level == 1 && item.id == data.id)?.stopEnabled ?? false}
      isFound={existingServices?.some((item) => item?.level == 1 && item.id == data.id) ?? false}
      editable={props?.editable}
      onChange={()=>{
        if (activeMainServicesValues?.includes(data?.id)) {
          if(props?.onChange){
            props?.onChange(1, [...(props?.activeMainServices?.filter((e) => e.serviceId !== data?.id) ?? [])]);
            props?.onChange(2, []);
            // props?.onChange(3, []);
          }
          return;
        }

        if(props?.onChange){
          props?.onChange(1, [
            ...(props?.activeMainServices ?? []),
            {serviceId:data.id,stopEnabled:false}
          ]);
        }
      }}
      onToggleStopped={(value)=>{
        if(props?.onToggleStopped){
          props?.onToggleStopped({level:1,id:value?.id,stopEnabled:value?.checked})
        }
      }}
      />
      <Dialog open={on} onOpenChange={toggle}>
        <DialogContent className="md:max-w-[720px] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dlgTitle}</DialogTitle>
            <DialogDescription/>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row gap-3 flex-wrap items-center justify-start">
              {data?.subServiceList && data?.subServiceList?.length > 0 ? (
                data?.subServiceList?.map((item) => (
                  <ServiceButton
                    showDetails={false}
                    editable={props?.editable}
                    stopped={existingServices?.find((e) => e?.level == 2 && e.id == item.id)?.stopEnabled ?? false}
                    isFound={existingServices?.some((e) => e?.level == 2 && e.id == item.id) ?? false}
                    onToggleStopped={(value)=>{
                      if(props?.onToggleStopped){
                        props?.onToggleStopped({level:2,id:value?.id,stopEnabled:value?.checked})
                      }
                    }}
                    key={`sub-${item.id}`}
                    {...item}
                    // onClick={() => {
                    //   handlePopulateDetails(item);
                    // }}
                    checked={activeSubServicesValues?.includes(item.id) ?? false}
                    onChange={()=>{
                      if (activeSubServicesValues?.includes(item?.id)) {
                        if(props?.onChange){
                          props?.onChange(2, [
                            ...(props?.activeSubServices?.filter(
                              (e) => e.serviceId !== item?.id
                            ) ?? []),
                          ]);
                          // props?.onChange(3, []);
                        }

                        return;
                      }
              
                      if(props?.onChange){
                        props?.onChange(2, [
                          ...(props?.activeSubServices ?? []),
                          {serviceId:item.id,stopEnabled:false}
                        ]);
                      }

                    }}
                  />
                ))
              ) : (
                <div className="w-full flex items-center justify-center">
                  <NoDataBox />
                </div>
              )}
            </div>
            {/* <div className="flex flex-row gap-2 flex-wrap items-center">
              {details &&
                details?.length > 0 &&
                details?.map((item) => {
                  return <Badge
                  title={props?.editable &&  !existingServices?.find((e) => e?.level == 3 && e.id == item.id)?.stopEnabled ? t("labels.stopped") : undefined }
                  variant={existingServices?.find((e) => e?.level == 3 && e.id == item.id)?.stopEnabled ? "danger" :  activeServicesDetailsValues?.includes(item.id) ? "destructive": "secondary"
                  }
                  key={item.id}
                  className="cursor-pointer flex flex-row gap-2"
                  onClick={() => {

                    if(props?.editable && existingServices?.some((e) => e?.level == 3 && e.id == item.id)){
                      if(existingServices?.find((e) => e?.level == 3 && e.id == item.id)?.stopEnabled){
                        if(props?.onToggleStopped ){
                          props?.onToggleStopped({level:3, id:item.id, stopEnabled : false});
                        }
                      }else{
                        if(props?.onToggleStopped){
                          props?.onToggleStopped({level:3, id:item.id, stopEnabled : true});
                        }
                      }
                      return;
                    }


                    if (activeServicesDetailsValues?.includes(item?.id)) {
                      if(props?.onChange){
                        props?.onChange(3, [
                          ...(props?.activeServicesDetails?.filter(
                            (e) => e.serviceId !== item?.id
                          ) ?? []),
                        ]);
                      }
                      return;
                    }
                    
                    if(props?.onChange){
                      props?.onChange(3, [
                        ...(props?.activeServicesDetails ?? []),
                        {serviceId:item.id,stopEnabled:false}
                      ]);
                    }
                  }}
                >
                  {isRtl ? item.arDesc : item?.enDesc}
                  {existingServices?.find((e) => e?.level == 3 && e.id == item.id)?.stopEnabled ? <Lock size={14}/> : <Unlock size={14}/>}
                </Badge>
                })}
            </div> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ServiceButtonSkeleton = () => {
  return (
    <Skeleton className="bg-secondary/10 p-2 rounded-md w-[160px] h-[160px]" />
  );
};

export const ServiceButton = ({
  editable = false,
  onClick,
  onChange,
  onToggleStopped,
  checked,
  stopped = false,
  isFound = false,
  showDetails = true,
  ...props
}: APIServiceItemResponseType & {
  editable?:boolean,
  onClick?: () => void;
  checked:boolean,
  onChange?:(checked:boolean)=>void,
  stopped?:boolean,
  isFound?:boolean,
  showDetails?:boolean
  onToggleStopped?: (value:{id:number,checked:boolean})=>void
}) => {
  const { t,isRtl } = useLocalizer();
  return (
    <div
      className={cn(
        "bg-secondary/10 p-2 rounded-md w-[170px] h-[160px] flex flex-col gap-2 items-center justify-evenly shadow-md cursor-pointer"
      )}
    >
      <Avatar>
        <AvatarImage src={props?.serviceImg ?? ""} />
        <AvatarFallback>{props?.arDesc}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 items-center justify-center">
        <span className="text-sm font-semibold text-primary text-center">
          {isRtl ? props?.arDesc : props?.enDesc}
        </span>
        <div className="flex flex-col gap-2">
         <div className="flex flex-row  justify-between items-center gap-2">
         < Checkbox checked={checked}  onCheckedChange={onChange} label={t("labels.choose")} disabled={isFound && editable} />
         {editable && < Checkbox checked={stopped}  onCheckedChange={(checked)=>{
            if(onToggleStopped){
              onToggleStopped({id:props.id,checked: checked as boolean});
            }
         }} label={t("labels.stopped")}  className="data-[state=checked]:bg-danger data-[state=checked]:text-white"/>}
         </div>
          {showDetails && <Button
            disabled={!checked}
            onClick={() => onClick && onClick()}
            variant="default"
            className="h-6"
          >
            {t("buttons.details")}
          </Button>
        }
        </div>
      </div>
    </div>
  );
};

export default ServiceContainerButton;
