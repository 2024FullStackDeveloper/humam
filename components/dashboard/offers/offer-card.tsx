"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useLocalizer from "@/lib/hooks/use-localizer";
import { ISubService } from "@/lib/schemas/services-schema";
import { APIOfferSubServiceProviderResponseType } from "@/lib/types/api/api-type";
import { Edit, X } from "lucide-react";
import Image from "next/image";
import z from "zod";

export interface OfferCardProps {
data:APIOfferSubServiceProviderResponseType,
onRemove : (id : number , providerOfferId:number,subServiceProviderId:number) => void,
};


const OfferCard: React.FC<OfferCardProps> = ({
    data,
    onRemove,
   }) => {

  const {t,isRtl} = useLocalizer();
  return (
    <div
      className="flex items-center justify-between p-3 border rounded"
    >
      <div className="flex items-center space-x-3 gap-2">
        {data?.subServiceDetails?.subServiceImg && (
          <Image
            src={data?.subServiceDetails?.subServiceImg}
            alt={data?.subServiceDetails.arDesc}
            className="rounded"
            width={40}
            height={40}
            objectFit="cover"
          />
        )}
        <div>
          <div className="font-medium">
            {isRtl ?  data?.subServiceDetails?.mainServiceArDesc : data?.subServiceDetails?.mainServiceEnDesc}
          </div>
            <div className="text-sm text-gray-500">
             {isRtl ?  data?.subServiceDetails?.arDesc : data?.subServiceDetails?.enDesc}
            </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(data.id , data.providerOfferId,data.subServiceProviderId)}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default OfferCard;
