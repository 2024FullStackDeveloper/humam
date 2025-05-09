import ApiAction from '@/lib/server/action';
import {  APIProviderServiceResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface ProviderServicesState extends CoreStateType<APIProviderServiceResponseType>{
    providerServices?:APIProviderServiceResponseType | null,
    getProviderServices:(provider:number)=>Promise<StateResponseType<any> | undefined | null>,
    patchProviderServices:(providerId:number,level:number,services:{id:number,stopEnabled:boolean}[])=>Promise<StateResponseType<any> | undefined | null>,
};

const useProviderServicesStore = create<ProviderServicesState>(
    (set)=>({
        isPending:false,
        result:undefined,
        users:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getProviderServices:async (providerId:number)=>{
           set({isPending:true,result:undefined , providerServices:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APIProviderServiceResponseType>(
            {
                controller:"services",
                url:`providers/${providerId}`,
                method:"GET",
            }
        );
        set({isPending:false, providerServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return {isPending:false, providerServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        patchProviderServices:async (providerId:number,level:number,services:{id:number,stopEnabled:boolean}[])=>{
            set({isPending:true,result:undefined , providerServices:undefined,code:undefined,message:undefined,});
            const response = await ApiAction(
             {
                 controller:"services",
                 url:"providers",
                 method:"PATCH",
                 authorized:true,
                 body:{
                    profileId:providerId,
                    level,
                    services,
                 }
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
         },
    })
);



export {
    type ProviderServicesState,
    useProviderServicesStore,
};