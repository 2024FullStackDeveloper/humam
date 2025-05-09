"use client";

import PageWrapper from "@/components/common/page-wrapper";
import SelectList from "@/components/common/select-list";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useRegionsStore } from "@/lib/features/regions/use-regions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { DocumentSchema } from "@/lib/schemas/settings-schema";
import { DropdownType } from "@/lib/types/common-type";
import { validateData } from "@/lib/utils/stuff-client";
import { BookA } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const UpdateRegionForm = ({regions,city}:{regions?:Array<DropdownType<number>>,city?:DropdownType<number> | null})=>{
    const {t} = useLocalizer();
    const [errors,setErrors] = React.useState<any | undefined>(undefined);
    const [request,setRequest] = React.useState<z.infer<typeof DocumentSchema>>({id:city?.addational?.toString() ?? '',arDesc:city?.arDesc ?? '',enDesc:city?.enDesc ?? ''});
    const {isPending,isServerOn,serverOffMessage,code,message,updateCity} = useRegionsStore();
    const router = useRouter();
    
    return <PageWrapper 
    breadcrumbs={[
        {
            itemTitle: "routes.home",
            link: "/dashboard",
          },
          {
            itemTitle: "routes.global_settings",
            link: "/dashboard",
          },
          {
            itemTitle: "routes.regions_cities",
            link:"/dashboard/regions"
          },
          {
            itemTitle: "routes.update",
          },
    ]}
    stickyButtomControls
      stickyRightButtonOptions={{
        loading:isPending,
        label:t("buttons.save"),
        onClick:async ()=>{
          setErrors(undefined);
          const validate = validateData(
            DocumentSchema,
            request
          );
    
          if (!validate.isValid) {
            setErrors(validate.errorsList);
            return;
          }
          if(city){
            const response = await updateCity(city?.id,request);
            if(!isServerOn){
              toast.error(t(serverOffMessage));
              return;
            }
            if(code == 0 && response){
              toast.success(message);
              router.push("/dashboard/regions");
              router.refresh();
              return;
            }else{
                toast.error(message);
            }
          }
        }
      }}
    >
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectList
                label={t("labels.region")}
                placeholder={t("placeholders.region")}
                options={regions ?? []}
                value={request?.id}
                prefixicon={<BookA />}
                onValueChange={(value) => {
                  setRequest({...request,id:value});
                }}
                 error={errors?.id && t(errors?.id?.[0])}
              />
              <Input
              maxLength={256}
              label={t("labels.ar_desc")}
              placeholder={t("placeholders.ar_desc")}
              value={request?.arDesc}
              prefixicon={<BookA/>}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,arDesc:value});
              }}
              error={errors?.arDesc && t(errors?.arDesc?.[0])}
              />
             <Input
              maxLength={256}
              label={t("labels.en_desc")}
              placeholder={t("placeholders.en_desc")}
              value={request?.enDesc}
              prefixicon={<BookA/>}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,enDesc:value});
              }}
              error={errors?.enDesc && t(errors?.enDesc?.[0])}
              />
      </div>
        
    
    </PageWrapper>
};
export default UpdateRegionForm; 