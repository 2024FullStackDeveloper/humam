"use client";

import PageWrapper from "@/components/common/page-wrapper";
import SelectList from "@/components/common/select-list";
import { Input } from "@/components/ui/input";
import { useCategoryStore } from "@/lib/features/categories/use-categories-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { DocumentSchema } from "@/lib/schemas/settings-schema";
import { DropdownType } from "@/lib/types/common-type";
import { validateData } from "@/lib/utils/stuff-client";
import { BookA } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const CreateCategoryForm = ({categories}:{categories?:Array<DropdownType<number>> | null}) => {  
    const {t} = useLocalizer();
    const [errors,setErrors] = React.useState<any | undefined>(undefined);
    const initial = {id:'',arDesc:'',enDesc:''};
    const [request,setRequest] = React.useState<z.infer<typeof DocumentSchema>>(initial);
    const {isPending,addNewSubCategory} = useCategoryStore();
    
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
            itemTitle: "routes.global_categories",
            link:"/dashboard/categories"
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
          const response = await addNewSubCategory(request);
          if(!response?.isServerOn){
            toast.error(t(response?.serverOffMessage));
            return;
          }
          if(response.code == 0 && response?.data){
            toast.success(response?.message);
            setRequest(initial);
            return;
          }
        }
      }}
    >
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SelectList
                label={t("labels.category")}
                placeholder={t("placeholders.category")}
                options={categories ?? []}
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
              value={request?.arDesc}
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
              value={request?.enDesc}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,enDesc:value});
              }}
              error={errors?.enDesc && t(errors?.enDesc?.[0])}
              />
      </div>
        
    
    </PageWrapper>
};

export default CreateCategoryForm;