import ApiAction from '@/lib/server/action';
import { APIAdsResponseType, APICollectionResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'
import z from "zod";
import { IAddAdsSchema, IPatchAdsSchema } from '@/lib/schemas/ads-schema';

interface AdsState extends CoreStateType<APIAdsResponseType>{
    ads?:Array<APIAdsResponseType> | null,
    getAds:(props?:PaginateType)=>Promise<void>,
    deleteAds(id:number): Promise<StateResponseType<number> | undefined | null>,
    addAds:(props : z.infer<typeof IAddAdsSchema>)=>Promise<StateResponseType<APIAdsResponseType | null | undefined>>,
    patchAds:(adsId : number ,props : z.infer<typeof IPatchAdsSchema>)=>Promise<StateResponseType<APIAdsResponseType | null | undefined>>
};

const useAdsStore = create<AdsState>(
    (set)=>({
        isPending:false,
        result:undefined,
        ads:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getAds:async (props)=>{
           set({isPending:true,result:undefined , ads:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIAdsResponseType>>(
            {
                controller:"ads",
                url:"",
                method:"GET",
                paginateOptions:props,
                authorized:true
            }
        );
        set({isPending:false,result:response,ads:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        }, 
        deleteAds:async (id:number)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<number | undefined | null>(
             {
                 controller:"ads",
                 url:`${id}`,
                 method:"DELETE",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
       addAds:async (props : z.infer<typeof IAddAdsSchema>)=>{
            const response = await ApiAction<APIAdsResponseType>(
             {
                 controller:"ads",
                 url:"",
                 method:"POST",
                 authorized:true,
                 body:props
             }
         );
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        patchAds:async (adsId : number ,  props : z.infer<typeof IPatchAdsSchema>)=>{
            const response = await ApiAction<APIAdsResponseType>(
             {
                 controller:"ads",
                 url:`${adsId}`,
                 method:"PATCH",
                 authorized:true,
                 body:props
             }
         );
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
    })
);



export {
    type AdsState,
    useAdsStore,
};