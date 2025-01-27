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

const CreateRegionForm = ({regions}:{regions?:Array<DropdownType<number>>})=>{
const {t} = useLocalizer();
const [errors,setErrors] = React.useState<any | undefined>(undefined);
const [request,setRequest] = React.useState<z.infer<typeof DocumentSchema>>({id:'',arDesc:'',enDesc:''});
const {isPending,isServerOn,serverOffMessage,code,message,addNewCity} = useRegionsStore();
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
        itemTitle: "routes.create",
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
      const response = await addNewCity(request);
      if(!isServerOn){
        toast.error(t(serverOffMessage));
        return;
      }
      if(code == 0 && response){
        toast.success(message);
        router.push("/dashboard/regions");
        router.refresh();
        return;
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
          prefixicon={<BookA/>}
          onChange={({currentTarget:{value}})=>{
            setRequest({...request,enDesc:value});
          }}
          error={errors?.enDesc && t(errors?.enDesc?.[0])}
          />
  </div>
    

</PageWrapper>
};
export default CreateRegionForm;