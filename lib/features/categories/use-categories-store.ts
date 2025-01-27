import { DocumentSchema } from '@/lib/schemas/settings-schema';
import ApiAction from '@/lib/server/action';
import { APICategoryResponseType, APICollectionResponseType, CategoryTypes, SubCategoryType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface CategoryState extends CoreStateType<APICategoryResponseType>{
    categories?:Array<APICategoryResponseType> | null,
    getCategories:(props?:PaginateType)=>Promise<void>,
    getSpecificCategory:(categoryId:number)=>Promise<APICategoryResponseType | undefined | null>,
    deleteSubCategory(subCategory:number): Promise<StateResponseType<SubCategoryType> | undefined | null>,
    addNewSubCategory(props:z.infer<typeof DocumentSchema>): Promise<StateResponseType<APICategoryResponseType> | undefined | null>,
    updateSubCategory(subCategoryId :number ,props:z.infer<typeof DocumentSchema>): Promise<StateResponseType<SubCategoryType> | undefined | null>,
};

const useCategoryStore = create<CategoryState>()(
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
                url:"get_categories",
                method:"GET",
                paginateOptions:props
            }
        );
        set({isPending:false,result:response,categories:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        } ,
        getSpecificCategory:async (categoryId)=>{
            set({isPending:true,result:undefined , categories:undefined,code:undefined,message:undefined,});
            const response = await ApiAction<APICategoryResponseType>(
             {
                 controller:"settings",
                 url:`get_categories/${categoryId}`,
                 method:"GET",
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return response?.result?.data;
         },
        deleteSubCategory:async (subCategory)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<SubCategoryType| undefined | null>(
             {
                 controller:"settings",
                 url:`delete_sub_category/${subCategory}`,
                 method:"DELETE",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
        addNewSubCategory:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APICategoryResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`add_new_sub_category`,
                 method:"POST",
                 body:{...props,id:parseInt(props.id)},
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
         },
         updateSubCategory:async (subCategory,props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<SubCategoryType| undefined | null>(
             {
                 controller:"settings",
                 url:`update_subcategory/${subCategory}`,
                 method:"PUT",
                 authorized:true,
                 body:{...props,id:parseInt(props.id)}
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
         }
    })
);



export {
    type CategoryState,
    useCategoryStore,
};