import UpdateCategoryForm from "@/components/dashboard/categories/update-category-form";
import { redirect } from "@/i18n/routing";
import ApiAction from "@/lib/server/action";
import { SubCategoryType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { getLocale } from "next-intl/server";

const UpdateCategoryPage = async (props: Promise<{
    searchParams?: { id: string }
  }>) => {
    const params = await props;
    const subCategoryId = params?.searchParams?.id;
    const locale = await getLocale();
    
    if(!subCategoryId){
       return redirect({href:"/dashboard/categories",locale:locale});
    }
    
    
    const parallelResult = await Promise.all([
      ApiAction<Array<DropdownType<number>>>({
      controller:"settings",
      url:"get_main_categories",
      method:"GET",
      revalidate:3600 * 24,
    }),ApiAction<SubCategoryType>({
      controller:"settings",
      url:`get_subcategory/${subCategoryId}`,
      method:"GET",
    })]);
    
    const response1 = parallelResult[0];
    const response2 = parallelResult[1];
    
    return <UpdateCategoryForm 
    categories={response1?.result?.data}
    subCategory={response2?.result?.data}
    />
};
export default UpdateCategoryPage;