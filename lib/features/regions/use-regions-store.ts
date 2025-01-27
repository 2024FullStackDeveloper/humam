import { DocumentSchema } from '@/lib/schemas/settings-schema';
import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIRegionResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, DropdownType, PaginateType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface RegionsState extends CoreStateType<APIRegionResponseType>{
    regions?:Array<APIRegionResponseType> | null,
    getRegions:(props?:PaginateType)=>Promise<void>,
    deleteCityById(cityId:number): Promise<DropdownType<number> | undefined | null>,
    addNewCity(props:z.infer<typeof DocumentSchema>): Promise<APIRegionResponseType | undefined | null>,
    updateCity(cityId :number ,props:z.infer<typeof DocumentSchema>): Promise<DropdownType<number> | undefined | null>,
};

const useRegionsStore = create<RegionsState>(
    (set)=>({
        isPending:false,
        result:undefined,
        users:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getRegions:async (props)=>{
           set({isPending:true,result:undefined , regions:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIRegionResponseType>>(
            {
                controller:"settings",
                url:"get_regions",
                method:"GET",
                paginateOptions:props
            }
        );
        set({isPending:false,result:response,regions:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        } ,
        deleteCityById:async (cityId)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<DropdownType<number> | undefined | null>(
             {
                 controller:"settings",
                 url:`delete_city/${cityId}`,
                 method:"DELETE",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return response.result?.data;
         } ,
         addNewCity:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APIRegionResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`add_new_city`,
                 method:"POST",
                 body:{...props,id:parseInt(props.id)},
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return response.result?.data;
         },
         updateCity:async (cityId,props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<DropdownType<number> | undefined | null>(
             {
                 controller:"settings",
                 url:`update_city/${cityId}`,
                 method:"PUT",
                 authorized:true,
                 body:props
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return response.result?.data;
         }
    })
);



export {
    type RegionsState,
    useRegionsStore,
};