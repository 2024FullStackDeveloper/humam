import ApiAction from '@/lib/server/action';
import {  APIProviderServiceResponseType, APIProviderServiceType} from '@/lib/types/api/api-type'
import { CoreStateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface ProviderServicesState extends CoreStateType<APIProviderServiceResponseType>{
    providerServices?:APIProviderServiceResponseType | null,
    getProviderServices:(provider:number)=>Promise<StateResponseType<APIProviderServiceResponseType> | undefined | null>,
    getActiveProviderServices:(provider:number)=>Promise<StateResponseType<Array<APIProviderServiceType>> | undefined | null>,
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
        return {isPending:false, data :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        getActiveProviderServices:async (providerId:number)=>{
           const response = await ApiAction<Array<APIProviderServiceType>>(
            {
                controller:"services",
                url:`providers/${providerId}/active`,
                method:"GET",
            }
        );
        return {data :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
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