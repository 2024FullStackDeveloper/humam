"use client";
import PageWrapper from "@/components/common/page-wrapper";
import SelectList from "@/components/common/select-list";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useCategoryStore } from "@/lib/features/categories/use-categories-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { DocumentSchema } from "@/lib/schemas/settings-schema";
import { SubCategoryType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { validateData } from "@/lib/utils/stuff-client";
import { BookA } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const UpdateCategoryForm = ({categories,subCategory}:{categories?:Array<DropdownType<number>> | null,subCategory?:SubCategoryType | null})=>{
      const {t} = useLocalizer();
    const [errors,setErrors] = React.useState<any | undefined>(undefined);
    const [request,setRequest] = React.useState<z.infer<typeof DocumentSchema>>({id:subCategory?.mainCategoryId?.toString() ?? '',arDesc:subCategory?.arDesc ?? '',enDesc:subCategory?.enDesc ?? ''});
    const {isPending,isServerOn,serverOffMessage,code,message,updateSubCategory} = useCategoryStore();
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
            itemTitle: "routes.global_categories",
            link:"/dashboard/categories"
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
          if(subCategory){
            const response = await updateSubCategory(subCategory?.id!,request);
            if(!response?.isServerOn){
              toast.error(t(serverOffMessage));
              return;
            }
            if(response?.code == 0 && response?.data){
              toast.success(response?.message);
              router.push("/dashboard/categories");
              router.refresh();
              return;
            }else{
                toast.error(response?.message);
            }
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

export default UpdateCategoryForm;