import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIUserProfileType, APIUserResponse2Type, APIUserResponseType } from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'
import z from "zod";
import { UpdateUserSchema, UserSchema } from '@/lib/schemas/users-schema';

interface UsersState extends CoreStateType<APIUserResponseType>{
    users?:Array<APIUserResponseType> | null,
    getUsers:(props?:PaginateType)=>Promise<void>,
    resetPassword:(phoneNumber:string)=>Promise<boolean>,
    changeStatus:(props:{profileId:number,statusCode:number})=>Promise<APIUserProfileType | undefined | null>,
    addNewUser:(props:z.infer<typeof UserSchema>)=>Promise<StateResponseType<APIUserResponse2Type> | undefined | null>,
    updateUserProfile:(profileId:number, props:z.infer<typeof UpdateUserSchema>)=>Promise<StateResponseType<APIUserResponse2Type> | undefined | null>,
    filterUsersByPhoneNumber:(phoneNumber:string)=>Promise<void>
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
                url:"users",
                method:"GET",
                authorized:true,
                paginateOptions:props
            }
        );
        set({isPending:false,result:response,users:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        } ,
        filterUsersByPhoneNumber:async (phoneNumber)=>{
           set({isPending:true,result:undefined , users:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIUserResponseType>>(
            {
                controller:"admin",
                url:"users",
                method:"POST",
                authorized:true,
                body:{
                    filters:[
                        {
                         field:"phoneNumber",
                         operator:"contains",
                         value:phoneNumber
                        }
                    ]
                }
            }
        );
        set({isPending:false,result:response,users:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        },
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
         },
         addNewUser:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,isServerOn:true,serverOffMessage:undefined});
            const response = await ApiAction<APIUserResponse2Type>(
             {
                 controller:"admin",
                 url:`users/add_new_user`,
                 method:"POST",
                 authorized:true,
                 body:{...props,phoneNumber:props?.phoneNumber.replace("+","").replace(" ","")}
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
         },
         updateUserProfile:async (profileId,props)=>{
            set({isPending:true,code:undefined,message:undefined,isServerOn:true,serverOffMessage:undefined});
            const response = await ApiAction<APIUserResponse2Type>(
             {
                 controller:"admin",
                 url:`users/update_user_profile/${profileId}`,
                 method:"PATCH",
                 authorized:true,
                 body:props
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
         }
    })
);



export {
    type UsersState,
    useUsersStore,
};