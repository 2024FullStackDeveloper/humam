"use client";
import DecorationBox from "@/components/common/decoration-box";
import FileUploader from "@/components/common/file-uploader";
import PageWrapper from "@/components/common/page-wrapper";
import PhoneNumberInput from "@/components/common/phone-number-input";
import RadioSwitchList from "@/components/common/radio-switch-list";
import SelectList from "@/components/common/select-list";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useCategoryStore } from "@/lib/features/categories/use-categories-store";
import { useRegionsStore } from "@/lib/features/regions/use-regions-store";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { UserSchema } from "@/lib/schemas/users-schema";
import { APIProviderServiceItemBaseeRsponseType, RoleTypes, SubCategoryType } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import {
  BookA,
  Building,
  FileBadge,
  IdCard,
  Mail,
  UserSquare2,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import z from "zod";
import {
  ServiceButtonSkeleton,
} from "./services/service-button";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import ServiceContainerButton from "./services/service-button";
import { useProviderServicesStore } from "@/lib/features/providers/use-providers-store";
const CreateUserForm = () => {
  const { t } = useLocalizer();
  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const [visibleServices,setVisibleServices] = React.useState<boolean>(false);
  const [request, setRequest] = React.useState<z.infer<typeof UserSchema>>({
    role: RoleTypes.admin,
    fullName: "",
    phoneNumber: "",
  });
  const { regions, getRegions } = useRegionsStore();
  const { getSpecificCategory } = useCategoryStore();
  const { addNewUser, isPending } = useUsersStore();
  const {patchProviderServices} = useProviderServicesStore();
  const {
    getAllServices,
    allServices,
    isPending: allServicePending,
  } = useServicesStore();

  const [activeMainServices, setActiveMainServices] = React.useState<
    Array<APIProviderServiceItemBaseeRsponseType>
  >([]);
  const [activeSubServices, setActiveSubServices] = React.useState<
    Array<APIProviderServiceItemBaseeRsponseType>
  >([]);
  const [activeServicesDetails, setActiveServicesDetails] = React.useState<
    Array<APIProviderServiceItemBaseeRsponseType>
  >([]);

  const [fetchLoading, setFetchLoading] = React.useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >(undefined);
  const [identityTypes, setIdentityTypes] = React.useState<
    Array<SubCategoryType> | undefined | null
  >(undefined);

  const router = useRouter();
  async function fetchData() {
    setFetchLoading(true);
    const response = await Promise.all([
      getRegions(),
      getSpecificCategory(1),
      getAllServices(),
    ]);
    if (response?.[1]) {
      setIdentityTypes(response?.[1]?.subs);
    }
    setFetchLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const getSelectedRegionCities = React.useMemo(():
    | Array<DropdownType<string>>
    | undefined => {
    if (!selectedRegion) return undefined;
    if (regions) {
      return regions
        ?.find((e) => e.id.toString() == selectedRegion)
        ?.cities?.map((e) => ({
          id: e.id.toString(),
          arDesc: e.arDesc,
          enDesc: e.enDesc,
        }));
    }
    return undefined;
  }, [selectedRegion]);





  return (
    <PageWrapper
      stickyButtomControls
      stickyRightButtonOptions={{
        loading: fetchLoading || isPending,
        label: t("buttons.save"),
        onClick: async () => {
          setErrors(undefined);

          const errorResult = validateData(UserSchema, request);
          if (!errorResult.isValid) {
            const errorsListResult = errorResult.errorsList;
            setErrors(errorsListResult);
            return;
          }

          if (request) {
            const response = await addNewUser(request);

            if (!response?.isServerOn) {
              toast.error(t(response?.serverOffMessage));
              return;
            }

            if (response?.code !== 0 && response?.fields) {
              setErrors(validateAPIErrors(response?.fields));

              return;
            } else if (response?.code !== 0) {
              toast.error(response?.message);
              return;
            } else if (response.code == 0 && response?.data) {

              //قبل اجراء عملية عرض رسالة الانشاء يتم اضافة الخدمات
              if(activeSubServices && activeSubServices.length > 0){
                 await patchProviderServices(response.data?.profileId,2,activeSubServices.map((e)=>({id:e.serviceId,stopEnabled:false})));
              }

              if(activeServicesDetails && activeServicesDetails.length > 0){
                await patchProviderServices(response.data?.profileId,3,activeServicesDetails.map((e)=>({id:e.serviceId,stopEnabled:false})));
              }
              //------------------------------------  
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
          itemTitle: "routes.create",
        },
      ]}
    >
      <div className="flex flex-col gap-4">
        <DecorationBox
          headerContent={t("titles.user_data")}
          className="flex flex-col gap-2"
        >
          <RadioSwitchList
            label={t("labels.role")}
            selectedOption={request?.role.toString()}
            onChange={(value) => {
              setErrors(undefined);
              if(value == "4"){
                // يتم توقيف الخدمات المتعلق بالادمن
                setRequest({ ...request,addionalData: {...request?.addionalData , mainServices: []}});
                setVisibleServices(false);
                setActiveMainServices([]);
                setActiveServicesDetails([]);
                setActiveSubServices([]);
                return;
              }
              setVisibleServices(true);
              setRequest({ ...request, role: parseInt(value) });
            }}
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
              value={request?.fullName ?? ""}
              onChange={({ currentTarget: { value } }) => {
                setRequest({ ...request, fullName: value });
              }}
              error={errors?.fullName && t(errors?.fullName?.[0])}
            />
            <PhoneNumberInput
              prefix="5"
              label={t("labels.phone_number")}
              value={request?.phoneNumber ?? ""}
              onValueChange={(value) => {
                setRequest({ ...request, phoneNumber: value ?? "" });
              }}
              error={errors?.phoneNumber && t(errors?.phoneNumber?.[0])}
            />
            <SelectList
              label={t("labels.region")}
              placeholder={t("placeholders.region")}
              options={
                regions?.map<DropdownType<string>>((e) => ({
                  id: e.id.toString(),
                  arDesc: e.arDesc,
                  enDesc: e.enDesc,
                })) ?? []
              }
              prefixicon={<BookA />}
              onValueChange={(value) => {
                setRequest({
                  ...request,
                  addionalData: { ...request?.addionalData, cityId: undefined },
                });
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
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    cityId: parseInt(value),
                  },
                });
              }}
              error={errors?.cityId && t(errors?.cityId?.[0])}
            />
            <Input
              maxLength={256}
              label={t("labels.email")}
              placeholder={t("placeholders.email")}
              prefixicon={<Mail />}
              value={request?.email ?? ""}
              onChange={({ currentTarget: { value } }) => {
                setRequest({ ...request, email: value });
              }}
              error={errors?.email && t(errors?.email?.[0])}
            />
            <FileUploader
              type="image"
              label={t("labels.profile_img")}
              onChange={(file) => {
                setRequest({
                  ...request,
                  addionalData: { ...request?.addionalData, personFile: file },
                });
              }}
              error={(errors?.personFile && t(errors?.personFile[0])) || (errors?.PersonFile && t(errors?.PersonFile[0]))}
            />

            {/* {request?.role == RoleTypes.admin && <Switch label={t("labels.is_super_user")} onCheckedChange={(checked)=>{
              setRequest({...request,isSuperUser:checked});
            }} />} */}
          </div>
        </DecorationBox>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DecorationBox 
          headerContent={t("titles.extra_data")}>
            <SelectList
              label={t("labels.identity_type")}
              placeholder={t("placeholders.identity_type")}
              options={identityTypes ?? []}
              value={request?.addionalData?.identityType?.toString()}
              prefixicon={<IdCard />}
              onValueChange={(value) => {
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    identityType: parseInt(value),
                  },
                });
              }}
              error={errors?.identityType && t(errors?.identityType?.[0])}
            />

            <Input
              label={t("labels.identity_number")}
              placeholder={t("placeholders.identity_number")}
              prefixicon={<IdCard />}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    identityNumber: value,
                  },
                });
              }}
              error={errors?.identityNumber && t(errors?.identityNumber?.[0])}
            />
            <FileUploader
              type="image"
              label={t("labels.identity_img")}
              onChange={(file) => {
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    identityFile: file,
                  },
                });
              }}
              error={(errors?.identityFile && t(errors?.identityFile[0])) || (errors?.IdentityFile && t(errors?.IdentityFile[0]))}
            />
          </DecorationBox>
          <DecorationBox 
          headerContent={t("titles.company_data")}>
            <Input
              maxLength={256}
              disabled={request?.role !== RoleTypes.organization}
              label={t("labels.organization_name")}
              placeholder={t("placeholders.organization_name")}
              prefixicon={<Building />}
              value={request?.addionalData?.organizationName?.toString() ?? ""}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    organizationName: value,
                  },
                });
              }}
              error={
                errors?.organizationName && t(errors?.organizationName?.[0])
              }
            />
            <Input
              maxLength={256}
              disabled={request?.role !== RoleTypes.organization}
              label={t("labels.cr_number")}
              placeholder={t("placeholders.cr_number")}
              prefixicon={<FileBadge />}
              value={request?.addionalData?.crNumber?.toString() ?? ""}
              onChange={({ currentTarget: { value } }) => {
                setRequest({
                  ...request,
                  addionalData: { ...request?.addionalData, crNumber: value },
                });
              }}
              error={errors?.crNumber && t(errors?.crNumber?.[0])}
            />
            <FileUploader
              type="image"
              disabled={request?.role !== RoleTypes.organization}
              label={t("labels.cr_number_img")}
              onChange={(file) => {
                setRequest({
                  ...request,
                  addionalData: {
                    ...request?.addionalData,
                    crNumberFile: file,
                  },
                });
              }}
              error={(errors?.crNumberFile && t(errors?.crNumberFile[0])) || (errors?.CRNumberFile && t(errors?.CRNumberFile))}
            />
          </DecorationBox>
        </div>
        { visibleServices && <DecorationBox headerContent={t("titles.services")} className="flex flex-col gap-2">
          {errors?.mainServices && <strong>{t(errors?.mainServices[0])}</strong>}
          <div className="flex flex-row flex-wrap gap-3 items-center">
            {allServicePending
              ? Array.from({ length: 4 }).map((_, index) => (
                  <ServiceButtonSkeleton key={index} />
                ))
              : allServices?.map((e) => (
                  <ServiceContainerButton
                    key={e.id}
                    data={e}
                    activeMainServices={activeMainServices}
                    activeSubServices={activeSubServices}
                    activeServicesDetails={activeServicesDetails}
                    dlgTitle={t("titles.linked_sub_services")}
                    onChange={(level, values) => {
                      switch (level) {
                        case 1:
                          setRequest({
                            ...request,
                            addionalData: {
                              ...request?.addionalData,
                              mainServices: values?.map(e=>e.serviceId),
                            },
                          });
                          setActiveMainServices(values);
                          break;

                        case 2:
                          setActiveSubServices(values);

                          break;

                        case 3:
                          setActiveServicesDetails(values);

                          break;
                      }
                    }}
                  />
                ))}
          </div>
        </DecorationBox>
        }
      </div>
    </PageWrapper>
  );
};
export default CreateUserForm;
