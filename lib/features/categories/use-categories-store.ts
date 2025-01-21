import ApiAction from '@/lib/server/action';
import { APICategoryResponseType, APICollectionResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface CategorysState extends CoreStateType<APICategoryResponseType>{
    categories?:Array<APICategoryResponseType> | null,
    getCategories:(props?:PaginateType)=>Promise<void>,
};

const useCategorysStore = create<CategorysState>(
    (set)=>({
        isPending:false,
        result:undefined,
        categories:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getCategories:async (props)=>{
           set({isPending:true,result:undefined , categories:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APICategoryResponseType>>(
            {
                controller:"settings",
                url:`get_categories ${props ? `?paginate=${props?.paginate}&page=${props?.page}&size=${props?.size}&sortedType=${props?.sortedType}&sortedField=${props?.sortedField}` : ''}`,
                method:"GET"
            }
        );
        set({isPending:false,result:response,categories:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        } ,
    })
);



export {
    type CategorysState,
    useCategorysStore,
};