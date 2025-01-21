import { UpdateGlobalSettingsSchema } from '@/lib/schemas/settings-schema';
import ApiAction from '@/lib/server/action';
import { APIGlobalSettingsResponseType,} from '@/lib/types/api/api-type'
import { CoreStateType, } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface GlobalSettingsState extends CoreStateType<undefined>{
    updateGlobalSettings:(props:z.infer<typeof UpdateGlobalSettingsSchema>)=>Promise<APIGlobalSettingsResponseType | undefined | null>
};

const useGlobalSettingsStore = create<GlobalSettingsState>(
    (set)=>({
        isPending:false,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        fields:undefined,
        updateGlobalSettings:async (props)=>{
           set({isPending:true,result:undefined,code:undefined,message:undefined,fields:undefined});
           const response = await ApiAction<APIGlobalSettingsResponseType | undefined | null>(
            {
                controller:"settings",
                url:"update_global_settings",
                method:"PUT",
                authorized:true,
                body:props
            }
        );
        set({isPending:false,fields:response.result?.fields,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return response?.result?.data;
        } 
    })
);



export {
    type GlobalSettingsState,
    useGlobalSettingsStore,
};