import DisplayTranscationsContainer from "@/components/dashboard/transcations/display-transcations-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "المعاملات",
};
const TranscationsPage = ()=>{
    return <DisplayTranscationsContainer/>
};

export default TranscationsPage;