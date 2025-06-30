import CreateCategoryForm from "@/components/dashboard/categories/create-category-form";
import ApiAction from "@/lib/server/action";
import { DropdownType } from "@/lib/types/common-type";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "اضافة فئة جديدة",
};
const CreateCategoryPage = async () => {

  const response = await ApiAction<Array<DropdownType<number>>>({
    controller:"settings",
    url:"get_main_categories",
    method:"GET",
    revalidate:60,
  });


  return <CreateCategoryForm  categories={response?.result?.data}/>;
};
export default CreateCategoryPage;