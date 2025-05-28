import { IAddCommonQuestionsSchema, IEditCommonQuestionsSchema } from '@/lib/schemas/common-questions-schema';
import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APICommonQuestionsResponseType } from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { z } from 'zod';
import { create } from 'zustand'

interface CommonQuestionsState extends CoreStateType<APICommonQuestionsResponseType> {
    commonQuestions?: Array<APICommonQuestionsResponseType> | null,
    getCommonQuestions: (props?: PaginateType) => Promise<void>,
    addCommonQuestion(props: z.infer<typeof IAddCommonQuestionsSchema>): Promise<StateResponseType<APICommonQuestionsResponseType> | undefined | null>,
    deleteCommonQuestion(id: number): Promise<StateResponseType<number> | undefined | null>,
    patchCommonQuestion(id:number , props : z.infer<typeof IEditCommonQuestionsSchema>): Promise<StateResponseType<APICommonQuestionsResponseType> | undefined | null>,
};

const useCommonQuestionsStore = create<CommonQuestionsState>(
    (set) => ({
        isPending: false,
        result: undefined,
        users: undefined,
        code: undefined,
        message: undefined,
        isServerOn: true,
        serverOffMessage: undefined,
        getCommonQuestions: async (props) => {
            set({ isPending: true, result: undefined, commonQuestions: undefined, code: undefined, message: undefined, });
            const response = await ApiAction<APICollectionResponseType<APICommonQuestionsResponseType>>(
                {
                    controller: "settings",
                    url: "common_questions",
                    method: "GET",
                    paginateOptions: props
                }
            );
            set({ isPending: false, result: response, commonQuestions: response.result?.data?.resultSet, code: response.result?.code, message: response.result?.message, isServerOn: response.isServerOn, serverOffMessage: response.serverOffMessage });
        },
        addCommonQuestion: async (props) => {
            set({ isPending: true, code: undefined, message: undefined, });
            const response = await ApiAction<APICommonQuestionsResponseType | undefined | null>(
                {
                    controller: "settings",
                    url: `common_questions`,
                    method: "POST",
                    body: props,
                    authorized: true
                }
            );
            set({ isPending: false, code: response.result?.code, message: response.result?.message, isServerOn: response.isServerOn, serverOffMessage: response.serverOffMessage });
            return { isPending: false, data: response?.result?.data, code: response.result?.code, message: response.result?.message, isServerOn: response.isServerOn, serverOffMessage: response.serverOffMessage }
        },
        deleteCommonQuestion: async (id: number) => {
            set({ isPending: true, code: undefined, message: undefined, });
            const response = await ApiAction<number | undefined | null>(
                {
                    controller: "settings",
                    url: `common_questions/${id}`,
                    method: "DELETE",
                    authorized: true
                }
            );
            set({ isPending: false, code: response.result?.code, message: response.result?.message, isServerOn: response.isServerOn, serverOffMessage: response.serverOffMessage });
            return { isPending: false, data: response?.result?.data, code: response.result?.code, message: response.result?.message, isServerOn: response.isServerOn, serverOffMessage: response.serverOffMessage }
        },
        patchCommonQuestion:async (id:number , props)=>{
            set({isPending:true,code:undefined,message:undefined,});
            const response = await ApiAction<APICommonQuestionsResponseType | undefined | null>(
             {
                 controller:"settings",
                 url:`common_questions/${id}`,
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
    type CommonQuestionsState,
    useCommonQuestionsStore,
};