import ApiAction from '@/lib/server/action';
import {APICollectionResponseType, APIOfferProvider, APIOfferResponseType, APIOfferSubServiceProviderResponseType, APISubServiceResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'
import z from "zod";
import { IAddOfferSchema, IPatchOfferSchema } from '@/lib/schemas/offers-schema';

interface OfferState extends CoreStateType<APIOfferResponseType>{
    offers?:Array<APIOfferResponseType> | null,
    addOffer:(props:z.infer<typeof IAddOfferSchema>)=>Promise<StateResponseType<APIOfferResponseType> | undefined | null>,
    patchOffer:(id:number , props:z.infer<typeof IPatchOfferSchema>)=>Promise<StateResponseType<APIOfferResponseType> | undefined | null>,
    getOffers:(props?:PaginateType)=>Promise<void>,
    getOfferProviders(id:number): Promise<StateResponseType<Array<APIOfferProvider>> | undefined | null>,
    getOfferProviderSubServices(id:number): Promise<StateResponseType<Array<APIOfferSubServiceProviderResponseType>> | undefined | null>,
    deleteOffer(id:number): Promise<StateResponseType<number> | undefined | null>,
    deleteOfferProvider(id:number,providerId:number): Promise<StateResponseType<number> | undefined | null>,
    deleteOfferProviderSubService(offerProviderId:number,subServiceId:number): Promise<StateResponseType<number> | undefined | null>,
    addOfferProviderSubServices(offerProviderId:number,subServices:Array<number>): Promise<StateResponseType<Array<APIOfferSubServiceProviderResponseType>> | undefined | null>,
};

const useOffersStore = create<OfferState>(
    (set)=>({
        isPending:false,
        result:undefined,
        offers:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getOffers:async (props)=>{
           set({isPending:true,result:undefined , offers:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIOfferResponseType>>(
            {
                controller:"admin",
                url:"offers",
                method:"GET",
                paginateOptions:props,
                authorized:true
            }
        );
        set({isPending:false,result:response,offers:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        }, 
        addOffer:async (props:z.infer<typeof IAddOfferSchema>)=>{
            const response = await ApiAction<APIOfferResponseType | undefined | null>(
                {
                    controller:"admin",
                    url:`offers`,
                    method:"POST",
                    authorized:true,
                    body:props
                }
            );
            return {isPending:false,data:response?.result?.data,fields:response?.result?.fields, code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        patchOffer:async (id:number , props:z.infer<typeof IPatchOfferSchema>)=>{
            const response = await ApiAction<APIOfferResponseType | undefined | null>(
                {
                    controller:"admin",
                    url:`offers/${id}`,
                    method:"PATCH",
                    authorized:true,
                    body:props
                }
            );
            return {isPending:false,data:response?.result?.data,fields:response?.result?.fields, code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        deleteOffer:async (id:number)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<number | undefined | null>(
                {
                    controller:"admin",
                    url:`offers/${id}`,
                    method:"DELETE",
                    authorized:true
                }
            );
            set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        deleteOfferProvider:async (id:number,providerId:number)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<number | undefined | null>(
                {
                    controller:"admin",
                    url:`offers/${id}/providers/${providerId}`,
                    method:"DELETE",
                    authorized:true
                }
            );
            set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        deleteOfferProviderSubService:async (offerProviderId:number,subServiceId:number)=>{
            const response = await ApiAction<number | undefined | null>(
                {
                    controller:"admin",
                    url:`offers/providers/services/${offerProviderId}`,
                    method:"DELETE",
                    authorized:true,
                    body:{
                        ProviderSubService:[
                            subServiceId
                        ]
                    }
                }
            );
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        addOfferProviderSubServices:async (offerProviderId:number,subServices:Array<number>)=>{
            const response = await ApiAction<Array<APIOfferSubServiceProviderResponseType> | undefined | null>(
                {
                    controller:"admin",
                    url:`offers/providers/services/${offerProviderId}`,
                    method:"POST",
                    authorized:true,
                    body:{
                        ProviderSubService:[
                            ...subServices
                        ]
                    }
                }
            );
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        getOfferProviders:async (id:number)=>{
            const response = await ApiAction<Array<APIOfferProvider>>(
                {
                    controller:"admin",
                    url:`offers/${id}/providers`,
                    method:"GET",
                    authorized:true
                }
            );
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        getOfferProviderSubServices:async (id:number)=>{
            const response = await ApiAction<Array<APIOfferSubServiceProviderResponseType>>(
                {
                    controller:"admin",
                    url:`offers/providers/services/${id}`,
                    method:"GET",
                    authorized:true
                }
            );
            return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
    })
);



export {
    type OfferState,
    useOffersStore,
};