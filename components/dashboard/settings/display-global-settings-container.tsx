"use client";
import DecorationBox from "@/components/common/decoration-box";
import LoadingButton from "@/components/common/loading-button";
import { NumericInput } from "@/components/common/numeric-input";
import PageWrapper from "@/components/common/page-wrapper";
import { Switch } from "@/components/ui/switch";
import { useGlobalSettingsStore } from "@/lib/features/settings/use-global-settings-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { UpdateGlobalSettingsSchema } from "@/lib/schemas/settings-schema";
import { APIGlobalSettingsResponseType } from "@/lib/types/api/api-type";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import { Info, LockIcon, LogIn } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import z from "zod";

const DisplayGlobalSettingsContainer = ({settings}:{settings?:APIGlobalSettingsResponseType | null}) => {
  const { t } = useLocalizer();
  const settingsValue = React.useDeferredValue(settings);
  const [request,setRequest] = React.useState<z.infer<typeof UpdateGlobalSettingsSchema>>({
    otpLength:settingsValue?.otpLength ?? 0,
    oldUserSessionsRemoveEnabled:settingsValue?.oldUserSessionsRemoveEnabled ?? false,
    passwordMaxLength:settingsValue?.passwordMaxLength ?? 0,
    passwordMinLength:settingsValue?.passwordMinLength ?? 0,
    complexPasswordEnabled:settingsValue?.complexPasswordEnabled ?? false,
    misLoginCount:settingsValue?.misLoginCount ?? 0,
    maxDistanceBetween:settingsValue?.maxDistanceBetween ?? 0,
  });
  const [errors,setErrors] = React.useState<any | undefined>(undefined);
  const {isPending,isServerOn,serverOffMessage, updateGlobalSettings , migrate} = useGlobalSettingsStore();
  const [migrationLoading, setMigrationLoading] = React.useState<boolean>(false);
  return (
    <PageWrapper
      stickyButtomControls
      stickyRightButtonOptions={{
        loading : isPending,
        label: t("buttons.save"),
        onClick:async ()=>{
          setErrors(undefined);
          const validate = validateData(
            UpdateGlobalSettingsSchema,
            request
          );

          if (!validate.isValid) {
            setErrors(validate.errorsList);
            return;
          }

          const response = await updateGlobalSettings(request);
          if(!isServerOn){
            toast.error(t(serverOffMessage));
            return;
          }

          if(response?.code !== 0 && response?.fields){
            setErrors(validateAPIErrors(response?.fields));
          }else if(response?.code === 0 && response?.data){
            toast.success(response?.message);
          } 
        }
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.global_settings",
        },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-5">
          <div>
             <LoadingButton 
             label={t("buttons.migrate")}
             loading={migrationLoading}
             onClick={async ()=>{
              setMigrationLoading(true);
              const response = await migrate();
              if(!response?.isServerOn){
                toast.error(t(response?.serverOffMessage));
                setMigrationLoading(false);
                return;
              }
              if(response?.code == 0 && response?.data){
                toast.success(response?.message);
              }else{
                toast.error(response?.message);
              }       
              setMigrationLoading(false);
             }}
             />
          </div>
         <Switch 
         label= {t("labels.remove_old_sessions")} 
         checked={request?.oldUserSessionsRemoveEnabled}
         onCheckedChange={(checked)=>{
          setRequest({...request,oldUserSessionsRemoveEnabled:checked});
         }}
         />

          <NumericInput
            label={t("labels.otp_length")}
            placeholder={t("placeholders.otp_length")}
            prefixicon={<LockIcon />}
            value={request?.otpLength}
            onValueChange={(value)=>{
              setRequest({...request,otpLength: value.value ? parseInt(value.value) : 0});
             }}
             error={errors?.otpLength && t(errors?.otpLength[0])}
          />

          <NumericInput
            label={t("labels.mis_login_count")}
            placeholder={t("placeholders.mis_login_count")}
            prefixicon={<LogIn />}
            value={request?.misLoginCount}
            onValueChange={(value)=>{
              setRequest({...request,misLoginCount:  value.value ? parseInt(value.value) : 0});
             }}
             error={errors?.misLoginCount && t(errors?.misLoginCount[0])}

          />

          <NumericInput
            label={t("labels.max_distance_between")}
            placeholder={t("placeholders.max_distance_between")}
            prefixicon={<LogIn />}
            value={request?.maxDistanceBetween}
            onValueChange={(value)=>{
              setRequest({...request,maxDistanceBetween:  value.value ? parseInt(value.value) : 0});
             }}
             error={errors?.maxDistanceBetween && t(errors?.maxDistanceBetween[0])}

          />
            <DecorationBox
            headerContent={<span className="text-sm lg:text-[16px]">
              {t("titles.password_settings")}
            </span>}
            >
            <NumericInput
              label={t("labels.password_min_length")}
              placeholder={t("placeholders.password_min_length")}
              prefixicon={<LockIcon />}
              value={request?.passwordMinLength}
              onValueChange={(value)=>{
                setRequest({...request,passwordMinLength: value.value ? parseInt(value.value) : 0});
               }}
               error={errors?.passwordMinLength && t(errors?.passwordMinLength[0])}

            />

            <NumericInput
              label={t("labels.password_max_length")}
              placeholder={t("placeholders.password_max_length")}
              prefixicon={<LockIcon />}
              value={request?.passwordMaxLength}
              onValueChange={(value)=>{
                setRequest({...request,passwordMaxLength: value.value ?  parseInt(value.value) : 0});
               }}
               error={errors?.passwordMaxLength && t(errors?.passwordMaxLength[0])}
            />
              <Switch 
              label={t("labels.complex_password")} 
              checked={request?.complexPasswordEnabled}
              onCheckedChange={(checked)=>{
                setRequest({...request,complexPasswordEnabled:checked});
               }}
              />
            </DecorationBox>
        </div>
      </div>
    </PageWrapper>
  );
};
export default DisplayGlobalSettingsContainer;
