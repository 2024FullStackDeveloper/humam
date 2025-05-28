"use client";

import LoadingButton from "@/components/common/loading-button";
import RadioSwitchList from "@/components/common/radio-switch-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCommonQuestionsStore } from "@/lib/features/common-questions/use-common-questions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { IAddCommonQuestionsSchema } from "@/lib/schemas/common-questions-schema";
import { validateData } from "@/lib/utils/stuff-client";
import { ShieldQuestion } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

export interface CommonQuestionAddDlgProps {
  title: string;
  createDlgVisible: boolean;
  onCreateDlgVisibleChange: (visible: boolean) => void;
  onAdded?: () => void;
}

const CommonQuestionAddDlg = ({
  title,
  createDlgVisible,
  onCreateDlgVisibleChange,
  ...props
}: CommonQuestionAddDlgProps) => {
  const { t, isRtl } = useLocalizer();
  const [request, setRequest] = React.useState<
    z.infer<typeof IAddCommonQuestionsSchema>
  >({
    arQuestion: "",
    enQuestion: "",
    arAnswer: "",
    enAnswer: "",
  });
  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const [langOption, setLangOption] = React.useState<string>(
    isRtl ? "ar" : "en"
  );
  const {addCommonQuestion,isPending} = useCommonQuestionsStore();

  const handleAddCommonQuestion = async () => {
        setErrors(undefined);
    const validate = validateData(IAddCommonQuestionsSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }
    const response = await addCommonQuestion(request);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
    onCreateDlgVisibleChange(false);
    setRequest({
        arQuestion: "",
        enQuestion: "",
        arAnswer: "",
        enAnswer: "",
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
        <RadioSwitchList
          selectedOption={langOption}
          label={t("labels.language")}
          onChange={setLangOption}
          options={[
            { id: "ar", enDesc: "Arabic", arDesc: "بالعربي" },
            { id: "en", enDesc: "English", arDesc: "بالانجليزي" },
          ]}
        />

        <div className="flex flex-col gap-4">
          <Input
            maxLength={256}
            label={t(
              `labels.${langOption == "ar" ? "ar_question" : "en_question"}`
            )}
            placeholder={t(
              `placeholders.${
                langOption == "ar" ? "ar_question" : "en_question"
              }`
            )}
            prefixicon={<ShieldQuestion />}
            value={
              langOption == "ar" ? request?.arQuestion : request?.enQuestion
            }
            onChange={({ currentTarget: { value } }) => {
              setRequest({
                ...request,
                [langOption == "ar" ? "arQuestion" : "enQuestion"]: value,
              });
            }}
            error={
              errors?.arQuestion || errors?.enQuestion
                ? t(errors?.arQuestion?.[0] || errors?.enQuestion?.[0])
                : undefined
            }
          />
          <Input
            maxLength={500}
            label={t(
              `labels.${langOption == "ar" ? "ar_answer" : "en_answer"}`
            )}
            placeholder={t(
              `placeholders.${langOption == "ar" ? "ar_answer" : "en_answer"}`
            )}
            prefixicon={<ShieldQuestion />}
            value={
              langOption == "ar" ? request?.arAnswer : request?.enAnswer
            }
            onChange={({ currentTarget: { value } }) => {
              setRequest({
                ...request,
                [langOption == "ar" ? "arAnswer" : "enAnswer"]: value,
              });
            }}
            error={
              errors?.arAnswer || errors?.enAnswer
                ? t(errors?.arAnswer?.[0] || errors?.enAnswer?.[0])
                : undefined
            }
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-2">
            <LoadingButton onClick={handleAddCommonQuestion} loading={isPending} label={t("buttons.save")} />
            <Button onClick={() => {
                onCreateDlgVisibleChange(false);
                setRequest({
                    arQuestion: "",
                    enQuestion: "",
                    arAnswer: "",
                    enAnswer: "",
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

export default CommonQuestionAddDlg;
