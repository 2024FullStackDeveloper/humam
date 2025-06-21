import ApiAction from '@/lib/server/action';
import { APICollectionResponseType, APITransactionResponseType, APIWalletResponseType, SendServiceOrderResponseDto} from '@/lib/types/api/api-type'
import { CoreStateType, PaginateType, StateResponseType } from '@/lib/types/common-type';
import { create } from 'zustand'

interface TransactionsState extends CoreStateType<APITransactionResponseType>{
    transactions?:Array<APITransactionResponseType> | null,
    getTransactions:(filter?:any,  props?:PaginateType)=>Promise<void>,
    updateTransaction(id:number): Promise<StateResponseType<boolean> | undefined | null>,
    getWallet(): Promise<StateResponseType<APIWalletResponseType> | undefined | null>,
    getOrderDetails(id:number): Promise<StateResponseType<SendServiceOrderResponseDto> | undefined | null>,
};

const useTransactionsStore = create<TransactionsState>(
    (set)=>({
        isPending:false,
        result:undefined,
        transactions:undefined,
        code:undefined,
        message:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        getTransactions:async (filter?:any,  props?:PaginateType)=>{
           set({isPending:true,result:undefined , transactions:undefined,code:undefined,message:undefined,});
           const response = await ApiAction<APICollectionResponseType<APITransactionResponseType>>(
            {
                controller:"admin",
                url:"trans",
                method:"POST",
                authorized:true,
                paginateOptions:props,
                body:{...filter}
            }
        );
        set({isPending:false,result:response,transactions:response.result?.data?.resultSet,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        },  
        getWallet:async ()=>{
           const response = await ApiAction<APIWalletResponseType>(
            {
                controller:"user",
                url:"profile/wallet",
                method:"GET",
                authorized:true,
                revalidate:5
            }
            
        );
        return {data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        }, 
        getOrderDetails:async (id:number)=>{
           const response = await ApiAction<SendServiceOrderResponseDto>(
            {
                controller:"admin",
                url:`orders/${id}`,
                method:"GET",
                authorized:true,
                revalidate:10
            }
            
        );
        return {data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        }, 
        updateTransaction:async (id:number )=>{
            const response = await ApiAction<boolean | undefined | null>(
             {
                 controller:"admin",
                url:`trans/${id}`,
                method:"PUT",
                authorized:true,
             }
         );
         return {isPending:false,data:response?.result?.data,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage}
        },       
    })
);



export {
    type TransactionsState,
    useTransactionsStore,
};