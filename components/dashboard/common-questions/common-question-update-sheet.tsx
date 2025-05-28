"use client";
import LoadingButton from "@/components/common/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCommonQuestionsStore } from "@/lib/features/common-questions/use-common-questions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { IEditCommonQuestionsSchema } from "@/lib/schemas/common-questions-schema";
import { APICommonQuestionsResponseType } from "@/lib/types/api/api-type";
import { validateData } from "@/lib/utils/stuff-client";
import { Edit2, ShieldQuestion } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
const CommonQuestionUpdateSheet: React.FC<{
  title: string;
  data?: APICommonQuestionsResponseType;
  onUpdated?: () => void;
}> = ({ title, data , ...props}) => {
  const { t } = useLocalizer();
  const commonQuestionDetailsValue = React.useDeferredValue(data);
  const [request, setRequest] = React.useState<
    z.infer<typeof IEditCommonQuestionsSchema>
  >({
    arQuestion: commonQuestionDetailsValue?.arQuestion || "",
    enQuestion: commonQuestionDetailsValue?.enQuestion || "",
    arAnswer: commonQuestionDetailsValue?.arAnswer || "",
    enAnswer: commonQuestionDetailsValue?.enAnswer || "",
  });
  const {isPending, patchCommonQuestion} = useCommonQuestionsStore();
  const [errors, setErrors] = React.useState<any | undefined>(undefined);

  const handleUpdateCommonQuestion = async () => {
    setErrors(undefined);
    const validate = validateData(IEditCommonQuestionsSchema, request);

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }
    const response = await patchCommonQuestion(commonQuestionDetailsValue?.id ?? 0, request);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      if (props.onUpdated) {
        props.onUpdated();
      }
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="destructive">
          <Edit2 />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex justify-evenly flex-col gap-4">
          <div className="flex flex-col gap-5 py-4">
            <Input
              maxLength={256}
              label={t("labels.ar_question")}
              placeholder={t("placeholders.ar_question")}
              prefixicon={<ShieldQuestion />}
              value={request.arQuestion}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  arQuestion: value,
                });
              }}
              error={errors?.arQuestion && t(errors?.arQuestion?.[0])}
            />
            <Textarea
              maxLength={500}
              label={t("labels.ar_answer")}
              placeholder={t("placeholders.ar_answer")}
              value={request.arAnswer}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  arAnswer: value,
                });
              }}
              error={errors?.arAnswer && t(errors?.arAnswer?.[0])}
            />
            <Input
              maxLength={256}
              label={t("labels.en_question")}
              placeholder={t("placeholders.en_question")}
              prefixicon={<ShieldQuestion />}
              value={request.enQuestion}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  enQuestion: value,
                });
              }}
              error={errors?.enQuestion && t(errors?.enQuestion?.[0])}
            />
            <Textarea
              maxLength={500}
              label={t("labels.en_answer")}
              placeholder={t("placeholders.en_answer")}
              value={request.enAnswer}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  enAnswer: value,
                });
              }}
              error={errors?.enAnswer && t(errors?.enAnswer?.[0])}
            />
          </div>
          <div>
            <LoadingButton 
            onClick={handleUpdateCommonQuestion}
            loading={isPending}
            label={t("buttons.save")} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommonQuestionUpdateSheet;
