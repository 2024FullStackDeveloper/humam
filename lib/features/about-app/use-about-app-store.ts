import { UpdateAboutAppSchema } from '@/lib/schemas/about-app-schema';
import ApiAction from '@/lib/server/action';
import {  APIAboutAppResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, StateResponseType, } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface GlobalAboutAppState extends CoreStateType<null>{
    updateAboutAppSettings:(props:z.infer<typeof UpdateAboutAppSchema>)=>Promise<StateResponseType<APIAboutAppResponseType>>
};

const useAboutAppStore = create<GlobalAboutAppState>(
    (set)=>({
        isPending:false,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        fields:undefined,
        updateAboutAppSettings:async (props)=>{
           set({isPending:true,result:undefined,code:undefined,message:undefined,fields:undefined});
           const response = await ApiAction<APIAboutAppResponseType | undefined | null>(
            {
                controller:"settings",
                url:"about_app",
                method:"PUT",
                authorized:true,
                body:props
            }
        );
        set({isPending:false,fields:response.result?.fields,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        } 
    })
);



export {
    type GlobalAboutAppState,
    useAboutAppStore,
};