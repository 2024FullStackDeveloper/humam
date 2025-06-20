import { IEditSocialMediaSchema, ISocialMediaSchema } from '@/lib/schemas/social-media-schema';
import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APISocialMediaResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface SocialMediaState extends CoreStateType<APISocialMediaResponseType>{
    socialMedias?:Array<APISocialMediaResponseType> | null,
    getSocialMedias:(props?:PaginateType)=>Promise<void>,
    addSocialMedia(props:z.infer<typeof ISocialMediaSchema>): Promise<StateResponseType<APISocialMediaResponseType> | undefined | null>,
    deleteSocialMedia(id:number): Promise<StateResponseType<number> | undefined | null>,
    patchSocialMedia(id:number , props : z.infer<typeof IEditSocialMediaSchema>): Promise<StateResponseType<APISocialMediaResponseType> | undefined | null>,
};

const useSocialMediaStore = create<SocialMediaState>(
    (set)=>({
        isPending:false,
        result:undefined,
        socialMedias:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getSocialMedias:async (props)=>{
           set({isPending:true,result:undefined , socialMedias:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APISocialMediaResponseType>>(
            {
                controller:"settings",
                url:"social_medias",
                method:"GET",
                paginateOptions:props
            }
        );
        set({isPending:false,result:response,socialMedias:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        },         
        addSocialMedia:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APISocialMediaResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`social_medias`,
                 method:"POST",
                 body:props,
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        deleteSocialMedia:async (id:number)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<number | undefined | null>(
             {
                 controller:"settings",
                 url:`social_medias/${id}`,
                 method:"DELETE",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
        patchSocialMedia:async (id:number , props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APISocialMediaResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`social_medias/${id}`,
                 method:"PATCH",
                 body:props,
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
    })
);



export {
    type SocialMediaState,
    useSocialMediaStore,
};