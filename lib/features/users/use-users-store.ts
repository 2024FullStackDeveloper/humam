import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIResponseType, APIUserProfileType, APIUserResponseType } from '@/lib/types/api/api-type'
import { CoreStateType, GlobalResponseType, PaginateType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface UsersState extends CoreStateType<APIUserResponseType>{
    users?:Array<APIUserResponseType> | null,
    getUsers:(props?:PaginateType)=>Promise<void>,
    resetPassword:(phoneNumber:string)=>Promise<boolean>,
    changeStatus:(props:{profileId:number,statusCode:number})=>Promise<APIUserProfileType | undefined | null>
};

const useUsersStore = create<UsersState>(
    (set)=>({
        isPending:false,
        result:undefined,
        users:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getUsers:async (props)=>{
           set({isPending:true,result:undefined , users:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIUserResponseType>>(
            {
                controller:"admin",
                url:`users ${props ? `?paginate=${props?.paginate}&page=${props?.page}&size=${props?.size}&sortedType=${props?.sortedType}&sortedField=${props?.sortedField}` : ''}`,
                method:"GET",
                authorized:true,
                revalidate:20
            }
        );
        set({isPending:false,result:response,users:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        } ,
        resetPassword:async (phoneNumber)=>{
            set({isPending:true,code:undefined,message:undefined,isServerOn:true,serverOffMessage:undefined});
            const response = await ApiAction<APICollectionResponseType<APIUserResponseType>>(
             {
                 controller:"admin",
                 url:`users/reset_password/${phoneNumber}`,
                 method:"POST",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return response.result?.data ? true : false;
         },
         changeStatus:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,isServerOn:true,serverOffMessage:undefined});
            const response = await ApiAction<APIUserProfileType>(
             {
                 controller:"admin",
                 url:`users/change_status`,
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
    type UsersState,
    useUsersStore,
};