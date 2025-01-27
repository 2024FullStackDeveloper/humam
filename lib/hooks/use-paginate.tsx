"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { PaginateType } from "../types/common-type";
import { isNaN } from "lodash";
import { usePathname, useRouter } from "@/i18n/routing";
const usePaginate = ()=>{
 const searchParams = useSearchParams();
 const urlSearchParams = new URLSearchParams(searchParams.toString());
 const router = useRouter();
 const path = usePathname();
 const [paginate,setPaginate] = React.useState<PaginateType | undefined>(undefined);
 React.useEffect(()=>{
    let paginateValue:PaginateType = {paginate:false,page: 0,size: 0};
    if(urlSearchParams){
        if(urlSearchParams.get("paginate")){
            paginateValue.paginate =  urlSearchParams.get("paginate") == "true" ? true : false;
            if(urlSearchParams.get("page")){
                paginateValue.page =  !isNaN(urlSearchParams.get("page")?.trim()) ? parseInt(urlSearchParams.get("page") ?? "0") : 0;
            }
            if(urlSearchParams.get("size")){
                paginateValue.size = !isNaN(urlSearchParams.get("size")?.trim()) ? parseInt(urlSearchParams.get("size") ?? "0") : 0;
            }
            setPaginate(paginateValue);
        }else{
            setPaginate(undefined);
        }
    }
 },[searchParams]);


 const isPaginateEnabled = React.useMemo(() : boolean=>{
    return paginate?.paginate == true;
 },[paginate]);

 const changePaginateSize = (limit:number)=>{
    if(isPaginateEnabled && urlSearchParams.get("size")){
        urlSearchParams.set("size",limit.toString());
        router.push({pathname:path,query:{paginate:true,page:paginate?.page,size:limit}});
        router.refresh();
    }
 };

 return {paginate,isPaginateEnabled,changePaginateSize} as const;

};
export default usePaginate;