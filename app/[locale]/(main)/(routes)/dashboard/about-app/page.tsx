import DisplayAboutAppContainer from "@/components/dashboard/about-app/display-about-app-container";
import ApiAction from "@/lib/server/action";
import { APIAboutAppResponseType } from "@/lib/types/api/api-type";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن التطبيق",
};


const AboutAppPage = async ()=>{

const respnse = await ApiAction<APIAboutAppResponseType>({
        controller:"settings",
        url:"about_app",
        method:"GET",
});

return <DisplayAboutAppContainer data={respnse?.result?.data }/>
};
export default AboutAppPage;