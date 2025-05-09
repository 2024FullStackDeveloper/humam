"use client";

import ActiveBudge from "@/components/common/active-budge";
import SingleRow from "@/components/common/single-row";
import TitleHeader from "@/components/common/title-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useRouter } from "@/i18n/routing";
import useLocalizer from "@/lib/hooks/use-localizer";
import dateFormat from "dateformat";
import { Building2, CalendarClockIcon, EditIcon, Eye, FileBadge, IdCard, Info, LockKeyholeIcon, LogIn, LogOut, Mail, Network, Phone, UserSquare } from "lucide-react";
import AccountStatusButton from "./account-status-button";
import { APIMainServiceResponseType, APIUserResponseType } from "@/lib/types/api/api-type";
import React from "react";
import UserServicesDlg from "./services/user-services-dlg";


const UserDetailsSheet = ({
 mainServices,
 data,
 isPending,
 onChangeStatus
}:{
mainServices?:Array<APIMainServiceResponseType> | null,
data:APIUserResponseType,
isPending?:boolean,
onChangeStatus?:({profileId,statusCode}:{profileId:number,statusCode:number})=>void
})=>{
const {t,isRtl} = useLocalizer();
const router = useRouter();
const services = React.useDeferredValue(mainServices);


return (
    <Sheet>
    <SheetTrigger asChild>
      <Button variant="default" title="عرض التفاصيل">
        <Info />
      </Button>
    </SheetTrigger>
    <SheetContent  >
      <SheetHeader>
        <SheetTitle>{t("titles.user_details")}</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-5 py-4">
      <SingleRow 
        icon={<UserSquare size={20}/>}
        label={t("labels.profile_img")}
        value={data.personImg ? <Link target="_blank" href={data.personImg}><Avatar >
          <AvatarImage className="rounded-full h-12 w-12" src={data.personImg}  alt="profile"/>
          <AvatarFallback>{data.phoneNumber}</AvatarFallback>
        </Avatar></Link> : <></>}
        />
        <SingleRow 
        icon={<Phone size={20}/>}
        label={t("labels.phone_number")}
        value={data.phoneNumber}
        />
       <SingleRow 
        icon={<UserSquare size={20}/>}
        label={t("labels.is_super_user")}
        value={<ActiveBudge isActive={data.isSuperUser}/>}
        />
        <SingleRow 
        icon={<Mail size={20}/>}
        label={t("labels.email")}
        value={data.email}
        title={data.email}
        />
        <SingleRow 
        icon={<LockKeyholeIcon size={20}/>}
        label={t("labels.lockoutEnabled")}
        value={<ActiveBudge isActive={data.lockoutEnabled ?? false}/>}
        />
        <SingleRow 
        icon={<CalendarClockIcon size={20}/>}
        label={t("labels.lockoutEnd")}
        value={data.lockoutEnd ? <bdi>{dateFormat(data.lockoutEnd,"dd/mm/yyyy hh:MM TT")}</bdi>  : <></>}
        />
        <SingleRow 
        icon={<LogIn size={20}/>}
        label={t("labels.last_log_in")}
        value={data.lastLogin ? <bdi>{dateFormat(data.lastLogin,"dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
        />
        <SingleRow 
        icon={<LogOut size={20}/>}
        label={t("labels.last_log_out")}
        value={data.lastLogOut ? <bdi>{dateFormat(data.lastLogOut,"dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
        />
        <SingleRow 
        icon={<LogIn size={20}/>}
        label={t("labels.accessFailedCount")}
        value={data.accessFailedCount}
        />
        <Separator/>
        <div className="flex flex-col gap-4">
          <TitleHeader 
          className="!h-14 rounded-none"
          title={t("titles.user_profiles")}
          />
          {
            data.profiles?.map(e=>(
              <div key={e.profileId} className="flex flex-col gap-5 border-b border-b-secondary pb-4">
                <Button onClick={()=>router.push(`/dashboard/users/update?id=${e.profileId}`)} variant="destructive" title={t("buttons.update")} disabled={data.isSuperUser && e.role  == "admin" || e.role == "client"}>
                  <EditIcon/>
                </Button>
                <div className="flex flex-col gap-2">
                <span className="text-sm font-bold">{t("labels.account_status")}</span>
              <AccountStatusButton 
                    loading={isPending ?? false}
                    disabled={data.isSuperUser}
                    role={e.role}
                    status={e.profileStatus} 
                    onClick={(_,stausCode)=>{
                        if(onChangeStatus){
                            onChangeStatus({profileId: e.profileId,statusCode:stausCode});
                        }
                    }}/>
               </div>
                <SingleRow 
                icon={<IdCard size={20}/>}
                label={t("labels.profile_id")}
                value={e.profileId}
                />
                <SingleRow 
                icon={<UserSquare size={20}/>}
                label={t("labels.name")}
                value={e.fullName}
                />
                <SingleRow 
                icon={<UserSquare size={20}/>}
                label={t("labels.role")}
                value={e.role}
                />
                <SingleRow 
                icon={<IdCard size={20}/>}
                label={t("labels.identity_type")}
                value={e.identity ? (isRtl ? e.identity.arDesc : e.identity.enDesc) : <></>}
                />
                <SingleRow 
                icon={<IdCard size={20}/>}
                label={t("labels.identity_number")}
                value={e?.identityNumber ?? <></>}
                />
                <SingleRow 
                icon={<IdCard size={20}/>}
                label={t("labels.identity_img")}
                value={e.identityImg ? <Link target="_blank" href={e?.identityImg}>
                    <Eye/>
                </Link> : <></>}
                />
                <SingleRow 
                icon={<IdCard size={20}/>}
                label={t("labels.city")}
                value={e.city ? (isRtl ? e.city.arDesc : e.city.enDesc) : <></>}
                />
                

                <SingleRow 
                icon={<CalendarClockIcon size={20}/>}
                label={t("labels.crtd_at")}
                value={e.crtdAt ? <bdi>{dateFormat(e.crtdAt,"dd/mm/yyyy hh:MM TT")}</bdi> : <></>}

                />

              <SingleRow 
              icon={<Network size={20}/>}
              label={t("labels.is_online")}
              value={<ActiveBudge isActive={e.isOnline}/>}
              />

                {
                  e.organizationDetails && <div className="flex flex-col gap-4">
                    <SingleRow 
                    icon={<Building2 size={20}/>}
                    label={t("labels.company_id")}
                    value={e?.organizationDetails.id}
                    />
                    <SingleRow 
                    icon={<Building2 size={20}/>}
                    label={t("labels.company_name")}
                    value={e?.organizationDetails.companyName}
                    />
                    <SingleRow 
                    icon={<FileBadge size={20}/>}
                    label={t("labels.cr_number")}
                    value={e?.organizationDetails.crNumber}
                    />
                    <SingleRow 
                    icon={<FileBadge size={20}/>}
                    label={t("labels.cr_number_img")}
                    value={e.identityImg ? <Link target="_blank" href={e?.organizationDetails.crNumberImg}>
                        <Eye/>
                    </Link> : <></>}
                    />
                  </div>
                }
                {(e?.mainServices && e?.mainServices?.length > 0) && <>
                <TitleHeader
                className="h-12 rounded-none"
                title={t("labels.services")}
                />
                
                  <ul>
                  {
                    e?.mainServices.map((c)=>(
                      <li className="flex flex-row justify-between items-center my-2" key={c}>
                        <span className="font-bold">.{services?.find((m)=>m.id == c)?.[isRtl ? "arDesc" : "enDesc"]}</span>
                        <UserServicesDlg 
                        mainServiceId={services?.find(ee=> ee.id === c)?.id ?? 0} 
                        providerId={e.profileId} />
                      </li>
                    ))
                    }
                  </ul>
                </>
                }

              </div>
            ))
          }
        </div>
      </div>
    </SheetContent>
  </Sheet>
)
};

export default UserDetailsSheet;