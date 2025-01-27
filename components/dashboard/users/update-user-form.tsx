"use client";
import DecorationBox from "@/components/common/decoration-box";
import FileUploader from "@/components/common/file-uploader";
import PageWrapper from "@/components/common/page-wrapper";
import PhoneNumberInput from "@/components/common/phone-number-input";
import RadioSwitchList from "@/components/common/radio-switch-list";
import SelectList from "@/components/common/select-list";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "@/i18n/routing";
import { useCategoryStore } from "@/lib/features/categories/use-categories-store";
import { useRegionsStore } from "@/lib/features/regions/use-regions-store";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { UpdateUserSchema } from "@/lib/schemas/users-schema";
import {  APIUserResponse2Type, RoleTypes, SubCategoryType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { getRoleTypeNumber, validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import { BookA, Building, FileBadge, IdCard, Mail, UserSquare2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import z from "zod";
const UpdateUserForm = ({userDetails}:{userDetails?:APIUserResponse2Type | null})=>{
    const { t } = useLocalizer();
    const [errors,setErrors] = React.useState<any | undefined>(undefined);
    const [request,setRequest] = React.useState<z.infer<typeof UpdateUserSchema>>({
      role:getRoleTypeNumber(userDetails!.role) ??  RoleTypes.admin,
      fullName:userDetails?.fullName ?? '',
      email:userDetails?.email ?? undefined
    });
    const userDetailsValue = React.useDeferredValue(userDetails);
    const {regions,getRegions} = useRegionsStore();
    const {getSpecificCategory} = useCategoryStore();
    const {updateUserProfile,isPending} = useUsersStore();
    const [fetchLoading,setFetchLoading] = React.useState<boolean>(false);
    const [selectedRegion,setSelectedRegion] = React.useState<string | undefined>(undefined);
    const [identityTypes,setIdentityTypes] = React.useState<Array<SubCategoryType> | undefined | null>(undefined);
    const [careerTypes,setCareerTypes] = React.useState<Array<SubCategoryType> | undefined | null>(undefined);
    const router = useRouter();

    async function fetchData() {
      setFetchLoading(true);
      const response = await Promise.all([getRegions(),getSpecificCategory(1),getSpecificCategory(2)]);
      if(response?.[1]){
        setIdentityTypes(response?.[1]?.subs);
      }
      if(response?.[2]){
        setCareerTypes(response?.[2]?.subs);
      }
      setFetchLoading(false);
    };
  
    React.useLayoutEffect(()=>{
      fetchData();
    },[]);
  
    React.useEffect(()=>{
      const result = {...request}
      if(userDetails){
        if(userDetails?.city){
          setSelectedRegion(userDetails?.city?.addational.toString());
          result.addionalData = {...result.addionalData,cityId:userDetails?.city?.id};
        }
        if(userDetails?.career){
          result.addionalData = {...result.addionalData,careerType:userDetails?.career?.id};
        }
        if(userDetails?.identity){
          result.addionalData = {...result.addionalData,identityType:userDetails?.identity?.id,identityNumber:userDetails?.identityNumber ?? undefined};
        }
        if(userDetails?.organizationDetails){
          result.addionalData = {...result.addionalData,organizationName:userDetails?.organizationDetails?.companyName, crNumber:userDetails?.organizationDetails?.crNumber};
        }
      }
      setRequest(result);
  },[userDetails]);
  
  const getSelectedRegionCities = React.useMemo((): Array<DropdownType<string>> | undefined=>{
    if(!selectedRegion) return undefined;
    if(regions){
      return regions?.find(e=>e.id.toString() == selectedRegion)?.cities?.map(e=>({id:e.id.toString(),arDesc:e.arDesc,enDesc:e.enDesc}))
    }
    return undefined;
  },[selectedRegion,regions]);
  
    return (
      <PageWrapper
        stickyButtomControls
        stickyRightButtonOptions={{
          loading:fetchLoading || isPending,
          label: t("buttons.update"),
          onClick: async () => {
            setErrors(undefined);
            const errorResult = validateData(UpdateUserSchema,request);
            if(!errorResult.isValid){
              setErrors(errorResult.errorsList);
              return;
            }
            if(request && userDetailsValue?.profileId){
              const response = await updateUserProfile( userDetailsValue?.profileId,request);
              if(!response?.isServerOn){
                toast.error(t(response?.serverOffMessage));
                return;
              }
              
              if(response?.code !== 0 && response?.fields){
                setErrors(validateAPIErrors(response?.fields))
                return;
              }else if(response?.code !== 0 ){
                toast.error(response?.message);
                return;
              }
              else if(response.code == 0 && response?.data){
                toast.success(response?.message);
                router.push("/dashboard/users");
                router.refresh();
                return;
              }
            }
          },
        }}
        breadcrumbs={[
          {
            itemTitle: "routes.home",
            link: "/dashboard",
          },
          {
            itemTitle: "routes.user_management",
            link: "/dashboard/users",
          },
          {
            itemTitle: "routes.update",
          },
        ]}
      >
        <div className="flex flex-col gap-4">
          <DecorationBox headerContent="بيانات المستخدم" className="flex flex-col gap-2">
          <RadioSwitchList
               disabled
               label={t("labels.role")}
                
                selectedOption={getRoleTypeNumber(userDetailsValue!.role).toString()}
                options={[
                  { id: "4", enDesc: "Admin", arDesc: "مدير" },
                  { id: "2", enDesc: "Worker", arDesc: "مهني" },
                  { id: "3", enDesc: "Organization", arDesc: "مؤسسة" },
                ]}
              />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                maxLength={256}
                label={t("labels.full_name")}
                placeholder={t("placeholders.full_name")}
                prefixicon={<UserSquare2 />}
                value={request?.fullName ?? ''}
                onChange={({currentTarget:{value}})=>{
                  setRequest({...request,fullName:value})
                }}
                error={errors?.fullName && t(errors?.fullName?.[0])}
              />
              <PhoneNumberInput
               disabled
               prefix="5"
               label={t("labels.phone_number")} 
               value={userDetailsValue?.phoneNumber ? '+' + userDetailsValue.phoneNumber : undefined}
               />
              <SelectList
                label={t("labels.region")}
                placeholder={t("placeholders.region")}
                options={regions?.map<DropdownType<string>>(e=>({
                  id:e.id.toString(),
                  arDesc:e.arDesc,
                  enDesc:e.enDesc
                })) ?? []}
                prefixicon={<BookA />}
                value={selectedRegion}
                onValueChange={(value)=>{
                  setRequest({...request,addionalData:{...request?.addionalData,cityId:undefined}});
                  setSelectedRegion(value);
  
                }}
              />
  
              <SelectList
                label={t("labels.city")}
                placeholder={t("placeholders.city")}
                options={getSelectedRegionCities ?? []}
                value={request?.addionalData?.cityId?.toString()}
                prefixicon={<BookA />}
                onValueChange={(value) => {
                  setRequest({...request,addionalData:{...request?.addionalData,cityId:parseInt(value)}})
                }}
                error={errors?.cityId && t(errors?.cityId?.[0])}
              />
              <Input
                maxLength={256}
                label={t("labels.email")}
                placeholder={t("placeholders.email")}
                prefixicon={<Mail />}
                value={request?.email ?? ''}
                onChange={({currentTarget:{value}})=>{
                  setRequest({...request,email:value})
                }}
                error={errors?.email && t(errors?.email?.[0])}
              />
              <FileUploader
               path={userDetailsValue?.personImg ?? undefined}
               type="image"
               label={t("labels.profile_img")}
               onChange={(file)=>{
                setRequest({...request,addionalData:{...request?.addionalData,personFile:file}});
               }}
               error={errors?.personFile}
               />
  
              {request?.role == RoleTypes.admin && <Switch label={t("labels.is_super_user")} checked={userDetailsValue?.isSuperUser} />}
            </div>
          </DecorationBox>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DecorationBox headerContent="بيانات اضافية">
             <SelectList
                label={t("labels.career")}
                placeholder={t("placeholders.career")}
                options={careerTypes ?? []}
                disabled = {request?.role !== RoleTypes.worker}
                value={request?.addionalData?.careerType?.toString()}
                prefixicon={<IdCard />}
                onValueChange={(value) => {
                  setRequest({...request,addionalData:{...request?.addionalData,careerType:parseInt(value)}})
                }}
                error={errors?.careerType && t(errors?.careerType?.[0])}
              />
  
              <SelectList
                label={t("labels.identity_type")}
                placeholder={t("placeholders.identity_type")}
                options={ identityTypes ?? []}
                value={request?.addionalData?.identityType?.toString()}
                prefixicon={<IdCard />}
                onValueChange={(value) => {
                  setRequest({...request,addionalData:{...request?.addionalData,identityType:parseInt(value)}})
                }}
                error={errors?.identityType && t(errors?.identityType?.[0])}
              />
  
              <Input
                label={t("labels.identity_number")}
                placeholder={t("placeholders.identity_number")}
                prefixicon={<IdCard />}
                value={request?.addionalData?.identityNumber?.toString() ?? ''}
                onChange={({currentTarget:{value}})=>{
                  setRequest({...request,addionalData:{...request?.addionalData,identityNumber:value}});
                }}
                error={errors?.identityNumber && t(errors?.identityNumber?.[0])}
              />
              <FileUploader 
               path={userDetailsValue?.identityImg ?? undefined}
              type="image"
              label={t("labels.identity_img")}
              onChange={(file)=>{
                setRequest({...request,addionalData:{...request?.addionalData,identityFile:file}});
               }}
               error={errors?.identityFile}
              />
          </DecorationBox>
          <DecorationBox headerContent="بيانات الشركة">
            <Input
              maxLength={256}
              disabled = {request?.role !== RoleTypes.organization}
              label={t("labels.organization_name")}
              placeholder={t("placeholders.organization_name")}
              prefixicon={<Building />}
              value={request?.addionalData?.organizationName?.toString() ?? ''}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,addionalData:{...request?.addionalData,organizationName:value}})
              }}
              error={errors?.organizationName && t(errors?.organizationName?.[0])}
            />
            <Input
              maxLength={256}
              disabled = {request?.role !== RoleTypes.organization}
              label={t("labels.cr_number")}
              placeholder={t("placeholders.cr_number")}
              prefixicon={<FileBadge />}
              value={request?.addionalData?.crNumber?.toString() ?? ''}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,addionalData:{...request?.addionalData,crNumber:value}})
              }}
              error={errors?.crNumber && t(errors?.crNumber?.[0])}
            />
          <FileUploader 
          path={userDetailsValue?.organizationDetails?.crNumberImg ?? undefined}
          type="image"
          disabled = {request?.role !== RoleTypes.organization}
          label={t("labels.cr_number_img")} 
          onChange={(file)=>{
            setRequest({...request,addionalData:{...request?.addionalData,crNumberFile:file}});
           }}
           error={errors?.crNumberFile}
          />
  
         </DecorationBox>
          </div>
  
        </div>
  
      </PageWrapper>
    );
};
export default UpdateUserForm;