"use server";
import { getServerSession } from "next-auth";
import { APIResponseType } from "../types/api/api-type";
import { GlobalResponseType, PaginateType } from "../types/common-type";
import getServerLocale from "../utils/stuff-server";
import authOptions from "@/auth.options";

export default async function ApiAction<TResponse>({
    controller,
    url,
    method = "GET",
    body,
    formData,
    paginateOptions,
    revalidate,
    authorized
}: {
    controller: string,
    url: string,
    method?: "POST" | "GET" | "PATCH" | "DELETE" | "PUT",
    body?: any | unknown,
    formData?: FormData,
    paginateOptions?:PaginateType,
    revalidate?: number,
    authorized?:boolean
}): Promise<GlobalResponseType<APIResponseType<TResponse>>> {

    
    const result : GlobalResponseType<APIResponseType<TResponse>> = {isServerOn:true};
    const baseUrl = process.env.BASE_API_URL!;
    const version = process.env.VERSION!;
    let fullUrl = `${baseUrl}/${controller}/${version}/${url}`.replace(" ","");
    if(paginateOptions){
        fullUrl+=`?paginate=${paginateOptions?.paginate}&page=${paginateOptions?.page}&size=${paginateOptions?.size}`;
    }
    const { lang } = await getServerLocale();
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if (body && formData) throw new Error("It can't use both  body and formData fields with same time.");
    try {
        const response = await fetch(fullUrl, {
            method,
            next: {
                revalidate,
            },
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": lang,
                "Authorization":  authorized == true ? "Token ".concat(token!) : ''
            },
            body: body ? JSON.stringify(body) : formData ? formData : null,
        });

        const jsonResponse = await response.json();
        if(jsonResponse) {
            result.result = jsonResponse as  APIResponseType<TResponse>;
        } 

    } catch {
        result.isServerOn = false;
        result.serverOffMessage = "errors.server_off";
        result.result = undefined;
    }

    return result;
}
