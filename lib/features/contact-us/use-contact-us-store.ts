import { IAddContactUsSchema } from '@/lib/schemas/contact-us-schema';
import { IEditSocialMediaSchema, ISocialMediaSchema } from '@/lib/schemas/social-media-schema';
import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APIContactUsResponseType, APISocialMediaResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface ContactUsState extends CoreStateType<APIContactUsResponseType>{
    contacts?:Array<APIContactUsResponseType> | null,
    getContacts:(props?:PaginateType)=>Promise<void>,
    addContact(props:z.infer<typeof IAddContactUsSchema>): Promise<StateResponseType<APIContactUsResponseType> | undefined | null>,
    deleteContact(id:number): Promise<StateResponseType<number> | undefined | null>,
};

const useContactUsStore = create<ContactUsState>(
    (set)=>({
        isPending:false,
        result:undefined,
        users:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getContacts:async (props)=>{
           set({isPending:true,result:undefined , contacts:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APIContactUsResponseType>>(
            {
                controller:"settings",
                url:"contact_us",
                method:"GET",
                paginateOptions:props
            }
        );
        set({isPending:false,result:response,contacts:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        },         
        addContact:async (props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APIContactUsResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`contact_us`,
                 method:"POST",
                 body:props,
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage,fields:response.result?.fields}
        },
        deleteContact:async (id:number)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<number | undefined | null>(
             {
                 controller:"settings",
                 url:`contact_us/${id}`,
                 method:"DELETE",
                 authorized:true
             }
         );
         set({isPending:false,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },
    })
);



export {
    type ContactUsState,
    useContactUsStore,
};