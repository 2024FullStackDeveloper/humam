"use client";
import LoadingButton from "@/components/common/loading-button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APISubServiceResponseType } from "@/lib/types/api/api-type";
import { Edit, Info, Trash, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import SubServiceForm from "./sub-service-form";
import z from "zod";
import { IEditSubService, ISubService } from "@/lib/schemas/services-schema";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import { toast } from "sonner";

export interface SubServiceDetailsCardProps {
  subService: z.infer<typeof IEditSubService>;
  onStatusChange: (id: number, checked: boolean) => void;
  onRemoveSubService: (id: number) => void;
  loading?: boolean;
}

const SubServiceDetailsCard: React.FC<SubServiceDetailsCardProps> = ({
  subService,
  onStatusChange,
  onRemoveSubService,
  loading = false,
}) => {
  const { t, isRtl } = useLocalizer();
  const [isSubServiceFormOpen,setIsSubServiceFormOpen] = React.useState<boolean>(false);
  const [subServiceDetails,setSubServiceDetails] = React.useState<z.infer<typeof IEditSubService>>(subService);

  React.useLayoutEffect(()=>{
    setSubServiceDetails(subService);
  },[subService])

  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div className="flex items-center space-x-3 gap-2">
        {subServiceDetails?.subServiceImg && (
          <Image
            src={subServiceDetails.subServiceImg}
            alt={subServiceDetails.arDesc}
            className="rounded"
            width={40}
            height={40}
            objectFit="cover"
          />
        )}
        <div>
          <div className="font-medium">
            {isRtl ? subServiceDetails?.arDesc : subServiceDetails?.enDesc}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">:</span>
            <Switch
              checked={subServiceDetails?.stopEnabled}
              onCheckedChange={(checked) => {
                onStatusChange(subServiceDetails.id, checked);
              }}
              label={t("labels.stopped")}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1 ">
        {isRtl && subServiceDetails?.arDetails ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="default" size="sm">
                <Info size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>{subServiceDetails?.arDetails}</PopoverContent>
          </Popover>
        ) : (
          subServiceDetails?.enDetails && (
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="default" size="sm">
                  <Info size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>{subServiceDetails?.enDetails}</PopoverContent>
            </Popover>
          )
        )}
        <Button
          size="sm"
          onClick={()=>setIsSubServiceFormOpen(true)}
          variant="destructive"
        >
          <Edit size={16} />
        </Button>
        <Button
          size="sm"
          onClick={() => onRemoveSubService(subService.id)}
          variant="dangerOutline"
          disabled={loading}
        >
          <Trash size={16} />
        </Button>

       <SubServiceForm
          isOpen={isSubServiceFormOpen}
          subService={subServiceDetails}
          autoEdit
          onClose={() => setIsSubServiceFormOpen(false)}
          onEditCompleted={(data)=>{
            setSubServiceDetails({
              ...data,
               subServiceImg:data?.subServiceImg ?? undefined
            })
          }}
          mode="edit" 
          />
        
      </div>
    </div>
  );
};

export default SubServiceDetailsCard;
