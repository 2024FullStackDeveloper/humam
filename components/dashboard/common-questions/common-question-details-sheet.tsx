"use client";

import SingleRow from "@/components/common/single-row";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import dateFormat from "dateformat";
import { CalendarClockIcon, Info, ShieldQuestion } from "lucide-react";
import { APICommonQuestionsResponseType, } from "@/lib/types/api/api-type";
import React from "react";


const CommonQuestionDetailsSheet = ({
 data,
}:{
data:APICommonQuestionsResponseType,
})=>{
const {t} = useLocalizer();
const commonQuestionDetailsValue = React.useDeferredValue(data);


return (
    <Sheet>
    <SheetTrigger asChild>
      <Button variant="default" title="عرض التفاصيل">
        <Info />
      </Button>
    </SheetTrigger>
    <SheetContent  >
      <SheetHeader>
        <SheetTitle>{t("titles.show_details")}</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-5 py-4">
        <SingleRow 
        mode="col"
        icon={<ShieldQuestion size={20}/>}
        label={t("labels.ar_question")}
        value={commonQuestionDetailsValue.arQuestion}
        />
        <SingleRow 
        mode="col"
        icon={<ShieldQuestion size={20}/>}
        label={t("labels.ar_answer")}
        value={commonQuestionDetailsValue.arAnswer}
        />
        <SingleRow 
        mode="col"
        icon={<ShieldQuestion size={20}/>}
        label={t("labels.en_question")}
        value={commonQuestionDetailsValue.enQuestion}
        />
        <SingleRow 
        mode="col"
        icon={<ShieldQuestion size={20}/>}
        label={t("labels.en_answer")}
        value={commonQuestionDetailsValue.enAnswer}
        />

        <SingleRow 
        icon={<CalendarClockIcon size={20}/>}
        label={t("labels.crtd_at")}
        value={commonQuestionDetailsValue.crtdAt ? <bdi>{dateFormat(commonQuestionDetailsValue.crtdAt,"dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
        />

        
        <SingleRow 
        icon={<CalendarClockIcon size={20}/>}
        label={t("labels.last_update_at")}
        value={commonQuestionDetailsValue.lastUpdateAt ? <bdi>{dateFormat(commonQuestionDetailsValue.lastUpdateAt,"dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
        />
     
      </div>
    </SheetContent>
  </Sheet>
)
};

export default CommonQuestionDetailsSheet;