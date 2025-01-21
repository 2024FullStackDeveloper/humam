import { UpdateGlobalSettingsSchema } from '@/lib/schemas/settings-schema';
import ApiAction from '@/lib/server/action';
import { APIErrorFieldType, APIGlobalSettingsResponseType,} from '@/lib/types/api/api-type'
import { CoreStateType, } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface GlobalSettingsState extends CoreStateType<null>{
    updateGlobalSettings:(props:z.infer<typeof UpdateGlobalSettingsSchema>)=>Promise<{
        code?:number,
        message?:string | null,
        fields?:Array<APIErrorFieldType> | null,
        data?:APIGlobalSettingsResponseType | null
    }>
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
        return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data};
        } 
    })
);



export {
    type GlobalSettingsState,
    useGlobalSettingsStore,
};