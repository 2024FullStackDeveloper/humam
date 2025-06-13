"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { X, Info } from "lucide-react";
import FileUploader from "@/components/common/file-uploader";
import useLocalizer from "@/lib/hooks/use-localizer";
import {
  toBase64,
  validateAPIErrors,
  validateData,
} from "@/lib/utils/stuff-client";
import z from "zod";
import { IEditSubService, ISubService } from "@/lib/schemas/services-schema";
import FormButton from "@/components/common/form-button";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import { toast } from "sonner";
import { APISubServiceResponseType } from "@/lib/types/api/api-type";

interface SubServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (subService: z.infer<typeof ISubService>) => void;
  onEditCompleted?: (data: APISubServiceResponseType) => void;
  subService?:
    | z.infer<typeof ISubService>
    | z.infer<typeof IEditSubService>
    | null;
  maxId?: number;
  mode: "create" | "edit";
  autoEdit?: boolean;
}

const SubServiceForm: React.FC<SubServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onEditCompleted,
  subService,
  maxId = 0,
  mode,
  autoEdit = false,
}) => {
  const intial = {
    id: 0,
    arDesc: "",
    enDesc: "",
    stopEnabled: false,
  };
  const [request, setRequest] = useState<
    z.infer<typeof ISubService> | z.infer<typeof IEditSubService>
  >(intial);
  const [errors, setErrors] = React.useState<any | undefined>(undefined);

  const { t } = useLocalizer();
  const { patchSubService } = useServicesStore();

  React.useLayoutEffect(() => {
    if (mode === "create") {
      setRequest({
        id: maxId + 1,
        arDesc: "",
        enDesc: "",
        stopEnabled: false,
        subServiceFile:{data:""}
      });
    } else {
      setRequest({
        id: subService?.id || 0,
        arDesc: subService?.arDesc || "",
        enDesc: subService?.enDesc || "",
        arDetails: subService?.arDetails || "",
        enDetails: subService?.enDetails || "",
        subServiceImg: subService?.subServiceImg ?? undefined,
        stopEnabled: subService?.stopEnabled || false,
      });
    }
  }, [subService, mode, maxId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(undefined);

    const validations = validateData(
      mode == "create" ? ISubService : IEditSubService,
      request
    );
    if (!validations.isValid) {
      setErrors(validations?.errorsList);
      console.log(mode,validations?.errorsList)
      return;
    }
    const submissionData = {
      ...request,
    };

    if (mode == "create") {
      if (onSubmit) {
        onSubmit(submissionData as z.infer<typeof ISubService>);
      }
      onClose();
    } else {
      if (autoEdit) {
        const response = await patchSubService(
          submissionData?.id,
          submissionData
        );
        if (response?.fields) {
          setErrors(validateAPIErrors(response?.fields));
          return;
        }
        if (response?.code == 0 && response?.data) {
          toast.success(response?.message);
          setRequest(intial);
          if (onEditCompleted) {
            onEditCompleted(response.data);
          }
          onClose();
        } else if (response?.code !== 0) {
          toast.error(response?.message);
        }
      } else {
        if (onSubmit) {
          onSubmit(submissionData as z.infer<typeof ISubService>);
        }
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]  overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("titles.add") : t("titles.update")}
          </DialogTitle>
          <DialogDescription/>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUploader
            type="image"
            label={t("labels.service_image")}
            path={mode == "edit" ? request?.subServiceImg : undefined}
            onChange={async (data, file) => {
              if (file) {
                setRequest({
                  ...request,
                  subServiceImg: await toBase64(file, false),
                  subServiceFile: data,
                });
                return;
              }
              setRequest({ ...request, subServiceFile: data });
            }}
            error={
              (errors?.subServiceFile && t(errors?.subServiceFile[0])) ||
              (errors?.SubServiceFile && t(errors?.SubServiceFile[0]))
            }
          />

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
                label={t("labels.en_desc")}
                placeholder={t("placeholders.en_desc")}
                prefixicon={<Info />}
                error={errors?.enDesc && t(errors?.enDesc[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="arDetails"
                value={request?.arDetails || ""}
                onChange={({ currentTarget: { value } }) => {
                  setRequest({ ...request, arDetails: value });
                }}
                label={t("labels.ar_details")}
                placeholder={t("placeholders.ar_details")}
                prefixicon={<Info />}
                error={errors?.arDetails && t(errors?.arDetails[0])}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="enDetails"
                value={request?.enDetails || ""}
                onChange={({ currentTarget: { value } }) => {
                  setRequest({ ...request, enDetails: value });
                }}
                dir="rtl"
                label={t("labels.en_details")}
                placeholder={t("placeholders.en_details")}
                prefixicon={<Info />}
                error={errors?.enDetails && t(errors?.enDetails[0])}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Switch
              id="isActive"
              checked={request.stopEnabled}
              onCheckedChange={(checked) =>
                setRequest({ ...request, stopEnabled: checked })
              }
              label={t("labels.stopped")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>
            <FormButton title={t("buttons.save")} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubServiceForm;
