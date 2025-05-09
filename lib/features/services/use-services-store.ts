import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIMainServiceResponseType, APIServiceInfoResponseType, APISubServiceResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface ServicesState extends CoreStateType<APIMainServiceResponseType>{
    mainServices?:Array<APIMainServiceResponseType> | null,
    subServices?:Array<APISubServiceResponseType> | null,
    allServices?:Array<APIServiceInfoResponseType> | null,
    getMainServices:(props?:PaginateType)=>Promise<void>,
    getSubServices:(mainServiceId:number,props?:PaginateType)=>Promise<void>,
    getAllServices:()=>Promise<void>,
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
           set({isPending:true,result:undefined , mainServices:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIMainServiceResponseType>>(
            {
                controller:"services",
                url:"",
                method:"GET",
                paginateOptions:props
            }
        );
        set({isPending:false,result:response, mainServices :response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
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