import DisplayCommonQuestionsContainer from "@/components/dashboard/common-questions/display-common-questions-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "الاسئلة الشائعة",
};
const CommonQuestionsPage = () => {
  return <DisplayCommonQuestionsContainer/>
}

export default CommonQuestionsPage;