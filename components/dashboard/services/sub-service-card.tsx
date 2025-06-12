"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useLocalizer from "@/lib/hooks/use-localizer";
import { ISubService } from "@/lib/schemas/services-schema";
import { Edit, X } from "lucide-react";
import Image from "next/image";
import z from "zod";

export interface SubServiceCardProps {
subService:z.infer<typeof ISubService>,
onStatusChange : (id:number,checked:boolean)=>void,
onRemoveSubService : (id:number) => void,
onEditSubService :(data:z.infer<typeof ISubService>)=>void
};


const SubServiceCard: React.FC<SubServiceCardProps> = ({
    subService,
    onStatusChange,
    onRemoveSubService,
    onEditSubService}) => {

  const {t,isRtl} = useLocalizer();
  return (
    <div
      className="flex items-center justify-between p-3 border rounded"
    >
      <div className="flex items-center space-x-3 gap-2">
        {subService?.subServiceImg && (
          <Image
            src={subService?.subServiceImg}
            alt={subService.arDesc}
            className="rounded"
            width={40}
            height={40}
            objectFit="cover"
          />
        )}
        <div>
          <div className="font-medium">
            {subService?.arDesc} / {subService?.enDesc}
          </div>
            <div className="text-sm text-gray-500">
              {isRtl ? subService?.arDetails ?? "" : subService?.enDetails ?? ""}
            </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">:</span>
            <Switch
              checked={subService?.stopEnabled}
              onCheckedChange={(checked) => {
                onStatusChange(subService.id,checked);
              }}
              label={t("labels.stopped")}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEditSubService(subService)}
        >
          <Edit size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemoveSubService(subService.id)}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SubServiceCard;
