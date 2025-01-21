import DisplayGlobalSettingsContainer from "@/components/dashboard/settings/display-global-settings-container";
import ApiAction from "@/lib/server/action";
import { APIGlobalSettingsResponseType } from "@/lib/types/api/api-type";
const SettingsPage = async ()=>{

const respnse = await ApiAction<APIGlobalSettingsResponseType>({
        controller:"settings",
        url:"get_global_settings",
        method:"GET",
});


const data = (respnse.isServerOn && respnse.result?.code == 0) ? respnse.result.data : undefined;


return <DisplayGlobalSettingsContainer settings={data}/>
};
export default SettingsPage;