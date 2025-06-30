import DisplayAdsContainer from "@/components/dashboard/ads/display-ads-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "الإعلانات",
};

const AdsPage = ()=>{
return <DisplayAdsContainer/>
};

export default AdsPage