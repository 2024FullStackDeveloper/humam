"use server";
import { cookies } from "next/headers";

const NEXT_LOCALE = "NEXT_LOCALE";
export default async function getServerLocale(){
 const _cookies = await cookies(); 
 const  locale = _cookies.get(NEXT_LOCALE)?.value || "ar";
 const isRtl = locale?.toLowerCase() == "ar";
 const dir = isRtl ? "rtl" : "ltr";
 return {locale,isRtl,dir};
};