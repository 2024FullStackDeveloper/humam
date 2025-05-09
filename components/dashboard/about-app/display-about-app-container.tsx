"use client";
import PageWrapper from "@/components/common/page-wrapper";
import { Textarea } from "@/components/ui/textarea";
import { useAboutAppStore } from "@/lib/features/about-app/use-about-app-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { UpdateAboutAppSchema } from "@/lib/schemas/about-app-schema";
import { APIAboutAppResponseType } from "@/lib/types/api/api-type";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import React from "react";
import { toast } from "sonner";
import z from "zod";

const DisplayAboutAppContainer = ({
  data,
}: {
  data?: APIAboutAppResponseType | null;
}) => {
  const { t } = useLocalizer();
  const aboutAppValue = React.useDeferredValue(data);
  const [request,setRequest] = React.useState<z.infer<typeof UpdateAboutAppSchema>>({
    arContent:aboutAppValue?.arContent ?? "",
    enContent:aboutAppValue?.enContent ?? "",
  });
  const [errors,setErrors] = React.useState<any | undefined>(undefined);
  const {isPending,isServerOn,serverOffMessage, updateAboutAppSettings} = useAboutAppStore();

  return (
    <PageWrapper
      stickyButtomControls
      stickyRightButtonOptions={{
        loading: isPending,
        label: t("buttons.save"),
        onClick: async () => {
          setErrors(undefined);
          const validate = validateData(UpdateAboutAppSchema, request);

          if (!validate.isValid) {
            setErrors(validate.errorsList);
            return;
          }

            const response = await updateAboutAppSettings(request);
            if(!isServerOn){
              toast.error(t(serverOffMessage));
              return;
            }

            if(response?.code !== 0 && response?.fields){
              setErrors(validateAPIErrors(response?.fields));
            }else if(response?.code === 0 && response?.data){
              toast.success(response?.message);
            }
        },
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.about_app",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-5">
          <Textarea
            label={t("labels.ar_desc")}
            placeholder={t("placeholders.ar_desc")}
            value={request?.arContent}
            onChange={({currentTarget:{value}}) => {
              setRequest({...request, arContent: value});
            }}
            error={errors?.arContent && t(errors?.arContent?.[0])}
            />
          <Textarea
            label={t("labels.en_desc")}
            placeholder={t("placeholders.en_desc")}
            value={request?.enContent}
            onChange={({currentTarget:{value}}) => {
              setRequest({...request, enContent: value});
            }}
            error={errors?.enContent && t(errors?.enContent?.[0])}
          />
        </div>
      </div>
    </PageWrapper>
  );
};
export default DisplayAboutAppContainer;
