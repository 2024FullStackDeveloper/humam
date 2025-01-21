import UpdateRegionForm from "@/components/dashboard/regions/update-region-form";
import { redirect } from "@/i18n/routing";
import ApiAction from "@/lib/server/action";
import { APICollectionResponseType, APIRegionResponseType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { getLocale } from "next-intl/server";

const UpdateRegionPage = async (props: Promise<{
    searchParams?: { id: string }
  }>)=>{

const params = await props;
const cityId = params?.searchParams?.id;
const locale = await getLocale();
if(!cityId){
   return redirect({href:"/dashboard/regions",locale:locale});
}


const parallelResult = await Promise.all([
  ApiAction<APICollectionResponseType<APIRegionResponseType>>({
  controller:"settings",
  url:"get_regions",
  method:"GET",
  revalidate:3600 * 24,
}),ApiAction<DropdownType<number>>({
  controller:"settings",
  url:`get_city/${cityId}`,
  method:"GET",
})]);

const response1 = parallelResult[0];
const response2 = parallelResult[1];


const regions = (response1.isServerOn && response1.result?.code == 0) ? response1.result.data?.resultSet?.flatMap<DropdownType<number>>(e=>({id:e.id,arDesc:e.arDesc,enDesc:e.enDesc})) : undefined;
return <UpdateRegionForm 
regions={regions} 
city={response2?.result?.data} />

};

export default UpdateRegionPage;