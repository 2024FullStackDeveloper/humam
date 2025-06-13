"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import FileUploader from "@/components/common/file-uploader";
import useLocalizer from "@/lib/hooks/use-localizer";
import z from "zod";
import FormButton from "@/components/common/form-button";
import {
  convertFiletimeToDate,
  dateToFileTime,
  validateAPIErrors,
  validateData,
} from "@/lib/utils/stuff-client";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/common/date-time-picker";
import CheckboxList, { CheckboxItem } from "@/components/common/checkbox-list";
import { IAddAdsSchema, IPatchAdsSchema } from "@/lib/schemas/ads-schema";
import { useAdsStore } from "@/lib/features/ads/use-ads-store";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import { APIAdsResponseType} from "@/lib/types/api/api-type";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateAdsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  adsDetails?: APIAdsResponseType | null
}

const UpdateAdsForm: React.FC<UpdateAdsFormProps> = ({ isOpen, adsDetails , onClose, onSubmit }) => {
  const { t } = useLocalizer();
  const initial = {
    ...adsDetails,
    showInMainSlider : adsDetails?.showInMainSlider ?? false,
    showInSubSlider : adsDetails?.showInSubSlider ?? false,
    stopEnabled: adsDetails?.stopEnabled ?? false,
    endExclusiveTimeStamp:adsDetails?.endExclusiveTimeStamp ?? undefined,
    endTimeStamp:adsDetails?.endTimeStamp ?? undefined,
    serviceProviders:adsDetails?.serviceProviders?.map(e=>(e.id))
  };

  const [request, setRequest] = useState<z.infer<typeof IPatchAdsSchema>>(initial);
  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const { patchAds } = useAdsStore();
  const { filterUserProfiles } = useUsersStore();
  const [providers, setProviders] = React.useState<Array<CheckboxItem> | null | undefined>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useLayoutEffect(()=>{
    setErrors(undefined);
    let details = initial;
    if(adsDetails?.serviceProviders && adsDetails?.serviceProviders?.length > 0){
        details.serviceProviders = adsDetails?.serviceProviders?.map(e=>(e.id));
    }else{
        details.serviceProviders = undefined;
    }

    setRequest(details);
  },[adsDetails]);

  const fetchProviders = async ()=>{
    setIsLoading(true);
    const response = await filterUserProfiles({
        filters: [
          {
            field: "role",
            operator: "contains",
            value: "worker",
            logic: "or",
          },
          {
            field: "role",
            operator: "contains",
            value: "organization",
            logic:"and"
          },
          {
            field: "profileStatusCode",
            operator: "equal",
            value: 5,
          },
        ],
      });

      if (response?.code == 0) {
        const  providersResult = response?.data?.filter(e=>e.profileStatusCode == 5)?.map((e) => ({
            id: e.profileId.toString(),
            label: e.fullName,
            checked: false,
          })) ?? [];

          const providerIds = adsDetails?.serviceProviders?.map(e=>(e.id));
          if(providerIds && providerIds?.length > 0){
            for (let index = 0; index < providerIds?.length; index++) {
                const element = providerIds[index];
                const elmentIndex = providersResult?.findIndex(e=>e.id == element.toString());
                if(elmentIndex != -1){
                providersResult[elmentIndex].checked = true;     
                }
            }
          }
        setProviders(providersResult);
      }
    setIsLoading(false);
  }

  React.useEffect(() => {
    fetchProviders();
    return ()=>{
    setProviders([]);
    setErrors(undefined);
    setIsLoading(false);
    }
  }, [adsDetails]);

  const handleSubmit = async () => {
    setErrors(undefined);

    const validate = validateData(IAddAdsSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }

    const response = await patchAds(adsDetails?.id ?? 0,request);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }

    if (response?.fields) {
      setErrors(validateAPIErrors(response?.fields));
      return;
    }

    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      setRequest(initial);
      onSubmit();
      setErrors(undefined);
      onClose();
    }else{
      toast.error(response.message);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger/>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("titles.update")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FileUploader
                    path={adsDetails?.background ?? undefined}
                    type="image"
                    label={t("labels.background")}
                    onChange={(file) => {
                      setRequest({ ...request, backgroundFile: file });
                    }}
                    error={
                      (errors?.backgroundFile &&
                        t(errors?.backgroundFile[0])) ||
                      (errors?.BackgroundFile && t(errors?.BackgroundFile[0]))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FileUploader
                   path={adsDetails?.thumbnail ?? undefined}
                    type="image"
                    label={t("labels.thumbnail")}
                    onChange={(file) => {
                      setRequest({ ...request, thumbnailFile: file });
                    }}
                    error={
                      (errors?.thumbnailFile && t(errors?.thumbnailFile[0])) ||
                      (errors?.ThumbnailFile && t(errors?.ThumbnailFile[0]))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="arDesc"
                  value={request?.arTitle}
                  onChange={({ currentTarget: { value } }) => {
                    setRequest({ ...request, arTitle: value });
                  }}
                  required
                  label={t("labels.ar_desc")}
                  placeholder={t("placeholders.ar_desc")}
                  prefixicon={<Info />}
                  error={errors?.arTitle && t(errors?.arTitle[0])}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="enDesc"
                  value={request?.enTitle}
                  onChange={({ currentTarget: { value } }) => {
                    setRequest({ ...request, enTitle: value });
                  }}
                  required
                  dir="rtl"
                  label={t("labels.en_desc")}
                  placeholder={t("placeholders.en_desc")}
                  prefixicon={<Info />}
                  error={errors?.enTitle && t(errors?.enTitle[0])}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <DateTimePicker
                  format24
                  value={
                    request?.endExclusiveTimeStamp
                      ? convertFiletimeToDate(request?.endExclusiveTimeStamp)
                      : undefined
                  }
                  onChange={(value) => {
                    if (value) {
                      setRequest({
                        ...request,
                        endExclusiveTimeStamp: parseInt(dateToFileTime(value).toString().replace("n","")),
                      });
                      return;
                    }
                    setRequest({
                      ...request,
                      endExclusiveTimeStamp: undefined,
                    });
                  }}
                  label={t("labels.end_exclusive_time_stamp")}
                  error={
                    errors?.endExclusiveTimeStamp &&
                    t(errors?.endExclusiveTimeStamp[0])
                  }
                />
              </div>
              <div className="space-y-2">
                <DateTimePicker
                  label={t("labels.end_time_stamp")}
                  format24
                  value={
                    request?.endTimeStamp
                      ? convertFiletimeToDate(request?.endTimeStamp)
                      : undefined
                  }
                  onChange={(value) => {
                    if (value) {
                      setRequest({
                        ...request,
                        endTimeStamp: parseInt(dateToFileTime(value).toString().replace("n","")),
                      });
                      return;
                    }
                    setRequest({ ...request, endTimeStamp: undefined });
                  }}
                  error={errors?.endTimeStamp && t(errors?.endTimeStamp[0])}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Textarea
                id="arContent"
                value={request?.arContent ?? undefined}
                onChange={({ currentTarget: { value } }) => {
                  setRequest({ ...request, arContent: value });
                }}
                label={t("labels.ar_content")}
                placeholder={t("placeholders.ar_content")}
                error={errors?.arContent && t(errors?.arContent[0])}
              />
              <Textarea
                id="enContent"
                value={request?.enContent ?? undefined}
                onChange={({ currentTarget: { value } }) => {
                  setRequest({ ...request, enContent: value });
                }}
                label={t("labels.en_content")}
                placeholder={t("placeholders.en_content")}
                error={errors?.enContent && t(errors?.enContent[0])}
              />
              <Switch
                isBetween
                label={t("labels.stopped")}
                checked={request?.stopEnabled}
                onCheckedChange={(checked) => {
                  setRequest({ ...request, stopEnabled: checked });
                }}
              />
              <Switch
                isBetween
                label={t("labels.show_in_main_slider")}
                checked={request?.showInMainSlider}
                onCheckedChange={(checked) => {
                  setRequest({ ...request, showInMainSlider: checked });
                }}
              />
              <Switch
                isBetween
                label={t("labels.show_in_sub_slider")}
                checked={request?.showInSubSlider}
                onCheckedChange={(checked) => {
                  setRequest({ ...request, showInSubSlider: checked });
                }}
              />
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-40 w-full rounded-md" />
              </div>
            ) : (
              <CheckboxList
                items={providers ?? []}
                title={t("labels.providers")}
                onItemChange={(id, checked) => {
                  let providersList =
                    request?.serviceProviders?.filter(
                      (e) => e.toString() !== id.toString()
                    ) ?? [];
                  if (checked) {
                    providersList = [...providersList, parseInt(id)];
                  }
                  setRequest({
                    ...request,
                    serviceProviders:
                      providersList?.length > 0 ? providersList : undefined,
                  });
                }}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  setRequest(initial);
                }}
              >
                {t("buttons.cancel")}
              </Button>
              <FormButton title={t("buttons.save")} />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateAdsForm;
