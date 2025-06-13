"use client";

import React, { useState} from "react";
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
import { Info, Percent } from "lucide-react";
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
import { IPatchOfferSchema } from "@/lib/schemas/offers-schema";
import { useOffersStore } from "@/lib/features/offers/use-offers-store";
import { APIOfferResponseType } from "@/lib/types/api/api-type";

interface UpdateOfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  details?:APIOfferResponseType | null
}

const UpdateOfferForm: React.FC<UpdateOfferFormProps> = ({ isOpen, onClose, onSubmit ,details }) => {
  const { t } = useLocalizer();
  const initial = {
    arDesc: details?.arDesc,
    enDesc: details?.enDesc,
    arContent:details?.arContent ?? undefined,
    enContent:details?.enContent ?? undefined,
    stopEnabled: details?.stopEnabled ?? false,
    includeTransportation: details?.includeTransportation ?? false,
    includeSpares: details?.includeSpares ?? false,
    startTimeStamp:details?.startTimeStamp ?? undefined,
    endTimeStamp:details?.endTimeStamp ?? undefined,
    discountRate:details?.discountRate
  };
  const [request, setRequest] = useState<z.infer<typeof IPatchOfferSchema>>(initial);
  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const { patchOffer } = useOffersStore();


  React.useEffect(()=>{
    setErrors(undefined);
    setRequest(initial)
  },[]);

    React.useLayoutEffect(()=>{
      setErrors(undefined);
      setRequest(initial);
    },[details]);

  const handleSubmit = async () => {
    setErrors(undefined);
    const validate = validateData(IPatchOfferSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }
    const response = await patchOffer(details?.id ?? 0,request);
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
      console.log(response);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger/>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("titles.add")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FileUploader
                    path={details?.backgroundImg ?? ""}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="arDesc"
                  value={request?.arDesc}
                  onChange={({ currentTarget: { value } }) => {
                    setRequest({ ...request, arDesc: value });
                  }}
                  required
                  label={t("labels.ar_desc")}
                  placeholder={t("placeholders.ar_desc")}
                  prefixicon={<Info />}
                  error={errors?.arDesc && t(errors?.arDesc[0])}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="enDesc"
                  value={request?.enDesc}
                  onChange={({ currentTarget: { value } }) => {
                    setRequest({ ...request, enDesc: value });
                  }}
                  required
                  dir="rtl"
                  label={t("labels.en_desc")}
                  placeholder={t("placeholders.en_desc")}
                  prefixicon={<Info />}
                  error={errors?.enDesc && t(errors?.enDesc[0])}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <DateTimePicker
                  format24
                  value={
                    request?.startTimeStamp
                      ? convertFiletimeToDate(request?.startTimeStamp)
                      : undefined
                  }
                  onChange={(value) => {
                    if (value) {
                      setRequest({
                        ...request,
                        startTimeStamp: parseInt(dateToFileTime(value).toString().replace("n","")),
                      });
                      return;
                    }
                  }}
                  label={t("labels.start_time_stamp")}
                  error={
                    errors?.startTimeStamp &&
                    t(errors?.startTimeStamp[0])
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
                  }}
                  error={errors?.endTimeStamp && t(errors?.endTimeStamp[0])}
                />
              </div>
            </div>

              <Input
                  id="discountRate"
                  type="number"
                  value={request?.discountRate ?? 0}
                  onChange={({ currentTarget: { value } }) => {
                    if(!isNaN(parseFloat(value))){
                    console.log(parseFloat(value))
                    setRequest({ ...request, discountRate: value ? parseFloat(value) : 0});
                    }
                  }}
                  required
                  dir="rtl"
                  label={t("labels.discount_rate")}
                  prefixicon={<Percent />}
                  error={errors?.discountRate && t(errors?.discountRate[0])}
                />

            <div className="flex flex-col gap-2">
              <Textarea
                id="arContent"
                value={request?.arContent}
                onChange={({ currentTarget: { value } }) => {
                  setRequest({ ...request, arContent: value });
                }}
                label={t("labels.ar_content")}
                placeholder={t("placeholders.ar_content")}
                error={errors?.arContent && t(errors?.arContent[0])}
              />
              <Textarea
                id="enContent"
                value={request?.enContent}
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
                label={t("labels.include_spares")}
                checked={request?.includeSpares}
                onCheckedChange={(checked) => {
                  setRequest({ ...request, includeSpares: checked });
                }}
              />
              <Switch
                isBetween
                label={t("labels.include_transportation")}
                checked={request?.includeTransportation}
                onCheckedChange={(checked) => {
                  setRequest({ ...request, includeTransportation: checked });
                }}
              />
            </div>

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

export default UpdateOfferForm;
