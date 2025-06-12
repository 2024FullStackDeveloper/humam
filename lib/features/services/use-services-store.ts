import { IAddService, IPatchMainService, IPatchSubService, ISubService } from '@/lib/schemas/services-schema';
import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIMainServiceResponseType, APIServiceInfoResponseType, APISubServiceResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface ServicesState extends CoreStateType<APIMainServiceResponseType>{
    mainServices?:Array<APIMainServiceResponseType> | null,
    subServices?:Array<APISubServiceResponseType> | null,
    allServices?:Array<APIServiceInfoResponseType> | null,
    getMainServices:(props?:PaginateType)=>Promise<void>,
    getSubServices:(mainServiceId:number,props?:PaginateType)=>Promise<void>,
    getAllServices:()=>Promise<void>,
    deleteMainService:(id:number)=>Promise<StateResponseType<number | null | undefined>>,
    deleteSubService:(id:number)=>Promise<StateResponseType<number | null | undefined>>,
    addService:(props : z.infer<typeof IAddService>)=>Promise<StateResponseType<APIMainServiceResponseType | null | undefined>>,
    addSubService:(mainServiceId : number , props : Array<z.infer<typeof ISubService>>)=>Promise<void>,
    patchMainService:(mainServiceId : number , props : z.infer<typeof IPatchMainService>)=>Promise<StateResponseType<APIMainServiceResponseType | null | undefined>>,
    patchSubService:(subServiceId : number , props : z.infer<typeof IPatchSubService>)=>Promise<StateResponseType<APISubServiceResponseType | null | undefined>>

};

const useServicesStore = create<ServicesState>(
    (set)=>({
        isPending:false,
        result:undefined,
        users:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getMainServices:async (props)=>{
           set({isPending:true,result:undefined , mainServices:undefined,code:undefined,message:undefined});
           const response = await ApiAction<APICollectionResponseType<APIMainServiceResponseType>>(
            {
                controller:"services",
                url:"",
                method:"GET",
                paginateOptions:props
            }
            
        );
        set({isPending:false, mainServices :response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
       },
       patchMainService:async (mainServiceId : number , props : z.infer<typeof IPatchMainService>)=>{
           const response = await ApiAction<APIMainServiceResponseType>(
            {
                controller:"services",
                url:`${mainServiceId}`,
                method:"PATCH",
                authorized : true,
                body:props
            }
        );
        return {result:response, data: response?.result?.data, fields:response?.result?.fields, mainServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        patchSubService:async (subServiceId : number , props : z.infer<typeof IPatchSubService>)=>{
           const response = await ApiAction<APISubServiceResponseType>(
            {
                controller:"services",
                url:`sub_services/${subServiceId}`,
                method:"PATCH",
                authorized : true,
                body:props
            }
        );
        return {result:response, data: response?.result?.data, fields:response?.result?.fields, mainServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        deleteMainService:async (id : number)=>{
           const response = await ApiAction<number>(
            {
                controller:"services",
                url:`${id}`,
                method:"DELETE",
                authorized : true,
            }
        );
        return {result:response, data: response?.result?.data, fields:response?.result?.fields, mainServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
       deleteSubService:async (id : number)=>{
           const response = await ApiAction<number>(
            {
                controller:"services",
                url:`sub_services/${id}`,
                method:"DELETE",
                authorized : true,
            }
        );
        return {result:response, data: response?.result?.data, fields:response?.result?.fields, mainServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        addService:async ( props : z.infer<typeof IAddService>)=>{
           set({isPending:true,code:undefined,message:undefined});
           const response1 = await ApiAction<APIMainServiceResponseType>(
            {
                controller:"services",
                url:"add_new_main_service",
                method:"POST",
                authorized : true,
                body:props
            }
        );
        if(response1?.result?.code == 0 && response1?.result?.data){
            if(props?.subServices && props?.subServices?.length > 0){
                props?.subServices.forEach(async e=>{
                await ApiAction<APISubServiceResponseType>(
                    {
                        controller:"services",
                        url:"add_new_sub_service",
                        method:"POST",
                        authorized : true,
                        body:{
                          ...e,
                          mainServiceId: response1?.result?.data?.id
                        }
                    }
                   );
                });
            }
        }
        set({isPending:false,code:response1?.result?.code,message:response1?.result?.message});
        return {result:response1, data: response1?.result?.data, fields:response1?.result?.fields,code:response1.result?.code,message:response1.result?.message,isServerOn:response1.isServerOn,serverOffMessage:response1.serverOffMessage};
        },
        addSubService:async (mainServiceId : number ,  props : Array<z.infer<typeof ISubService>>)=>{
            if(props && props?.length > 0){
                props?.forEach(async e=>{
                await ApiAction<APISubServiceResponseType>(
                    {
                        controller:"services",
                        url:"add_new_sub_service",
                        method:"POST",
                        authorized : true,
                        body:{
                          ...e,
                          mainServiceId: mainServiceId
                        }
                    }
                   );
                });
        }
        },
        getSubServices:async (mainServiceId,props)=>{
            set({isPending:true,result:undefined,subServices:undefined,code:undefined,message:undefined});
            const response = await ApiAction<APICollectionResponseType<APISubServiceResponseType>>(
             {
                 controller:"services",
                 url:`${mainServiceId}/sub_services`,
                 method:"GET",
                 paginateOptions:props
             }
         );

         set({isPending:false,result:response, subServices :response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         },
         getAllServices:async ()=>{
            set({isPending:true,result:undefined,allServices:undefined,code:undefined,message:undefined});
            const response = await ApiAction<Array<APIServiceInfoResponseType>>(
             {
                 controller:"services",
                 url:"all_services",
                 method:"GET",
             }
         );

         set({isPending:false, allServices :response.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         } 
    })
);



export {
    type ServicesState,
    useServicesStore,
};