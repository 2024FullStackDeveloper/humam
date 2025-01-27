import UpdateUserForm from "@/components/dashboard/users/update-user-form";
import { redirect } from "@/i18n/routing";
import ApiAction from "@/lib/server/action";
import { APIUserResponse2Type } from "@/lib/types/api/api-type";
import { getLocale } from "next-intl/server";
import React from "react";
const UpdateUserPage = async (props: Promise<{
  searchParams?: { id: string }
}>)=>{

const params = await props;
const profileId = params?.searchParams?.id;
const locale = await getLocale();
if(!profileId){
    return redirect({href:"/dashboard/users",locale:locale});
}
    
const response = await ApiAction<APIUserResponse2Type>({
controller:"admin",
url:`users/get_user_profile/${profileId}`,
authorized:true,
method:"GET"
});

if(response?.result?.code == 0 && response?.result?.data){
  return <UpdateUserForm  userDetails={response?.result?.data}/>
}

return redirect({href:"/dashboard/users",locale:locale});


};
export default UpdateUserPage;