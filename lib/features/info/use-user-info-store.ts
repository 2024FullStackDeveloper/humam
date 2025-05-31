import ApiAction from '@/lib/server/action';
import {   APILoginUserDetailsResponseType,} from '@/lib/types/api/api-type'
import { CoreStateType, StateResponseType, } from '@/lib/types/common-type';
import { create } from 'zustand'
import { z } from 'zod';
import { IPatchUserInfoSchema } from '@/lib/schemas/users-schema';

interface UserInfoState extends CoreStateType<null>{
    userInfo?:APILoginUserDetailsResponseType | null,
    getUserInfo:()=>Promise<StateResponseType<APILoginUserDetailsResponseType | null>>,
    patchUserInfo:(props : z.infer<typeof IPatchUserInfoSchema>)=>Promise<StateResponseType<APILoginUserDetailsResponseType | null>>,
};

const useUserInfoStore = create<UserInfoState>(
    (set)=>({
        isPending:false,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        fields:undefined,
        getUserInfo:async ()=>{
           set({isPending:true,result:undefined,userInfo:undefined,code:undefined,message:undefined,fields:undefined});
           const response = await ApiAction<APILoginUserDetailsResponseType | undefined | null>(
            {
                controller:"user",
                url:"info",
                method:"GET",
                authorized:true,
            }
        );
        set({isPending:false,userInfo:response?.result?.data, fields:response.result?.fields,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
         patchUserInfo:async (props)=>{
           set({isPending:true, userInfo: undefined, result:undefined,code:undefined,message:undefined,fields:undefined});
           const response = await ApiAction<APILoginUserDetailsResponseType | undefined | null>(
            {
                controller:"user",
                url:"info",
                method:"PATCH",
                authorized:true,
                body:props,
            }
        );
        set({isPending:false, userInfo: response?.result?.data, fields:response.result?.fields,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
    })
);



export {
    type UserInfoState,
    useUserInfoStore,
};