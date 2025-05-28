"use client";

import LoadingButton from "@/components/common/loading-button";
import PhoneNumberInput from "@/components/common/phone-number-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useContactUsStore } from "@/lib/features/contact-us/use-contact-us-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { IAddContactUsSchema } from "@/lib/schemas/contact-us-schema";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

export interface ContactUsAddDlgProps {
  title: string;
  createDlgVisible: boolean;
  onCreateDlgVisibleChange: (visible: boolean) => void;
  onAdded?: () => void;
}

const ContactUsAddDlg = ({
  title,
  createDlgVisible,
  onCreateDlgVisibleChange,
  ...props
}: ContactUsAddDlgProps) => {
  const { t, isRtl } = useLocalizer();
  const [request, setRequest] = React.useState<z.infer<typeof IAddContactUsSchema>>({phoneNumber:""});

  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const {addContact,isPending} = useContactUsStore();

  const handleAddContact = async () => {
    setErrors(undefined);
    const validate = validateData(IAddContactUsSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }
    const response = await addContact({...request,phoneNumber: request.phoneNumber.replace("+","").trim()});
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }

    if (response?.fields){ 
      setErrors(validateAPIErrors(response?.fields));
      return;
    }

    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
    onCreateDlgVisibleChange(false);
    setRequest({
        phoneNumber: "",
    });
    setErrors(undefined);
    if (props.onAdded) {
      props.onAdded();
    }
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <Dialog open={createDlgVisible} onOpenChange={onCreateDlgVisibleChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Separator className="my-3" />
          <DialogDescription />
        </DialogHeader>
     

        <div className="flex flex-col gap-4">
          <PhoneNumberInput
            maxLength={15}
            label={t( `labels.phone_number`)}
            placeholder={t(`placeholders.phone_number`)}
            value={request.phoneNumber}
            onValueChange={(value) => {
              setRequest({
                ...request,
                phoneNumber: value ?? "",
              });
            }}
            error={errors?.phoneNumber  && t(errors?.phoneNumber?.[0])}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-2">
            <LoadingButton 
            onClick={handleAddContact} 
            loading={isPending} 
            label={t("buttons.save")} />
            <Button onClick={() => {
                onCreateDlgVisibleChange(false);
                setRequest({
                    phoneNumber: "",
                });
                setErrors(undefined);
            }} variant="secondary">
              {t("buttons.cancel")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsAddDlg;
