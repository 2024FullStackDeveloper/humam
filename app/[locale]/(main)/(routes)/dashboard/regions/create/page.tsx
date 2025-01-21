import CreateRegionForm from "@/components/dashboard/regions/create-region-form";
import ApiAction from "@/lib/server/action";
import { APICollectionResponseType, APIRegionResponseType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
const CreateRegionPage = async ()=>{
const response = await ApiAction<APICollectionResponseType<APIRegionResponseType>>({
    controller:"settings",
    url:"get_regions?paginate=false",
    method:"GET",
    revalidate:3600 * 24,
});

const regions = (response.isServerOn && response.result?.code == 0) ? response.result.data?.resultSet?.flatMap<DropdownType<number>>(e=>({id:e.id,arDesc:e.arDesc,enDesc:e.enDesc})) : undefined;
return <CreateRegionForm regions={regions}/>
};
export default CreateRegionPage;