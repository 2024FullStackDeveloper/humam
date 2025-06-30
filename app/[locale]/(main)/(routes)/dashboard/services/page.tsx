import DisplayMainServicesContainer from "@/components/dashboard/services/display-main-services-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "الخدمات الرئيسية",
};
const ServicesPage = ()=>{
    return <DisplayMainServicesContainer/>
}
export default ServicesPage;