import DisplayCatgoriesContainer from "@/components/dashboard/categories/display-categories-container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "الفئات العامة",
};
const CategoriesPage = ()=>{
return <DisplayCatgoriesContainer />
};
export default CategoriesPage;