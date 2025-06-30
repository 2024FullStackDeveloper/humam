import DisplayOffersContainer from "@/components/dashboard/offers/display-offers-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "العروض",
};
const OffersPage = ()=>{
    return <DisplayOffersContainer/>
}

export default OffersPage;