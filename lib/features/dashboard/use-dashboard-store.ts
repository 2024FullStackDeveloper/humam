import ApiAction from '@/lib/server/action';
import {   APIDashboardResponseType} from '@/lib/types/api/api-type'
import { CoreStateType, StateResponseType, } from '@/lib/types/common-type';
import { create } from 'zustand'

interface DashboardState extends CoreStateType<null>{
    statistics?:APIDashboardResponseType | null,
    getDashboard:()=>Promise<StateResponseType<APIDashboardResponseType | null>>,
};

const useDashboardStore = create<DashboardState>(
    (set)=>({
        isPending:false,
        code:undefined,
        message:undefined,
        statistics:undefined,
        isServerOn:true,
        serverOffMessage:undefined,
        fields:undefined,
        getDashboard:async ()=>{
           set({isPending:true,result:undefined,statistics:undefined,code:undefined,message:undefined,fields:undefined});
           const response = await ApiAction<APIDashboardResponseType>(
            {
                controller:"admin",
                url:"dashboard",
                method:"GET",
                authorized:true,
                revalidate:10
            }
        );
        set({isPending:false,statistics:response?.result?.data, fields:response.result?.fields,code:response.result?.code,message:response.result?.message,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage});
        return {code:response?.result?.code,message:response?.result?.message,fields:response?.result?.fields,data:response?.result?.data,isServerOn:response.isServerOn,serverOffMessage:response.serverOffMessage};
        },
    })
);



export {
    type DashboardState,
    useDashboardStore,
};