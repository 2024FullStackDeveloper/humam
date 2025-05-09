"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React, { startTransition } from "react";
import ToggleServices from "./toggle-services";
import ApiAction from "@/lib/server/action";
import {
  APICollectionResponseType,
  APIProviderServiceResponseType,
  APISubServiceResponseType,
} from "@/lib/types/api/api-type";
import useLocalizer from "@/lib/hooks/use-localizer";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

const UserServicesDlg = ({
  providerId,
  mainServiceId
}: {
  mainServiceId: number;
  providerId: number;
}) => {
  const [subServices, setSubServices] = React.useState<
    Array<APISubServiceResponseType> | undefined | null
  >([]);
  const [providerServicesDetails, setProviderServicesDetails] = React.useState<
    Array<number> | undefined | null
  >([]);
  const [providerServices,setProviderServices] = React.useState<APIProviderServiceResponseType | undefined | null>(undefined);
  const isMainServiceLocked = React.useCallback(()=>{
    return providerServices?.mainServices?.find(e=>e.serviceId == mainServiceId)?.stopEnabled;
  },[providerServices,mainServiceId]);

  const { t } = useLocalizer();

  React.useEffect(() => {
    startTransition(async () => {
      const response = await Promise.all([
        ApiAction<APIProviderServiceResponseType>({
          controller: "services",
          url: `providers/${providerId}`,
          method: "GET",
          revalidate: 5,
        }),
        ApiAction<APICollectionResponseType<APISubServiceResponseType>>({
          controller: "services",
          url: `${mainServiceId}/sub_services`,
          method: "GET",
          revalidate: 0,
        }),
      ]);

      if (
        response[1]?.result?.code == 0 &&
        response[1]?.result.data?.resultSet &&
        response[1]?.result.data?.resultSet?.length > 0
      ) {
        const subs = response[1]?.result.data?.resultSet;
        if (
          response[0]?.result?.code == 0 &&
          response[0]?.result?.data?.subServices &&
          response[0]?.result?.data?.subServices?.length > 0
        ) {
          setProviderServices(response?.[0]?.result?.data)
          const providerSubs: Array<APISubServiceResponseType> = [];
          for (const subItem of response[0]?.result?.data?.subServices) {
            const item = subs?.find((e) => e.id == subItem.serviceId);
            if (item) {
              providerSubs.push({...item,stopEnabled:subItem.stopEnabled});
            }
          }
          setSubServices(providerSubs);
        }
      }

      if (response[0]?.result?.code == 0) {
        const providerServices = response[0]?.result?.data?.servicesDetails;
        if (providerServices && providerServices.length > 0) {
          const ids = providerServices.map((item) => item.serviceId);
          setProviderServicesDetails(ids);
        }
      }
    });

    return () => {
      setSubServices([]);
      setProviderServicesDetails([]);
    };
  }, [mainServiceId, providerId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">{t("buttons.show")} {isMainServiceLocked() ? <Lock/> : <Unlock/> }</Button>
      </DialogTrigger>
      <DialogContent  className="md:max-w-[720px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("titles.linked_sub_services")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Separator />
        <ToggleServices
          providerServices={providerServices}
          subServices={subServices}
          serviceDetailsIds={providerServicesDetails}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserServicesDlg;
