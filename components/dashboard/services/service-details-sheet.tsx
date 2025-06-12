"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import { CalendarClock, Info, InfoIcon, LockIcon } from "lucide-react";
import {
  APICollectionResponseType,
  APIMainServiceResponseType,
  APISubServiceResponseType,
} from "@/lib/types/api/api-type";
import React, { useTransition } from "react";
import Image from "next/image";
import SingleRow from "@/components/common/single-row";
import dateFormat from "dateformat";
import ActiveBudge from "@/components/common/active-budge";
import TitleHeader from "@/components/common/title-header";
import ApiAction from "@/lib/server/action";
import { Skeleton } from "@/components/ui/skeleton";
import SubServiceDetailsCard from "./sub-service-details-card";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import { toast } from "sonner";
import { orderBy } from "lodash";
import z from "zod";
import { IEditSubService } from "@/lib/schemas/services-schema";

const ServiceDetailsSheet = ({
  visible,
  onVisibleChange,
  data,
}: {
  data: APIMainServiceResponseType | undefined;
  visible: boolean;
  onVisibleChange: () => void;
}) => {
  const { t, isRtl } = useLocalizer();
  const serviceDetailsValue = React.useDeferredValue(data);
  const [subServices, setSubServices] = React.useState<
    Array<APISubServiceResponseType>
  >([]);
  const [isPending, startTransaition] = useTransition();
  const fetchData = async () => {
    const result = await ApiAction<
      APICollectionResponseType<APISubServiceResponseType>
    >({
      controller: "services",
      url: `${data?.id}/sub_services`,
      method: "GET",
    });

    if (result?.result?.code == 0) {
      setSubServices(orderBy(result?.result?.data?.resultSet ?? [],"id"));
    }
  };

  React.useEffect(() => {
    startTransaition(async () => {
      await fetchData();
    });
  }, [data]);

  const { deleteSubService, patchSubService } = useServicesStore();
  const [deleteDetails, setDeleteDetails] = React.useState<
    { id: number; loading: boolean } | undefined
  >(undefined);

  const handleRemoveSubService = async (id: number) => {
    setDeleteDetails({ id: id, loading: true });
    const response = await deleteSubService(id);
    if (response?.code !== 0) {
      toast.error(t("errors.unable_delete"));
    }
    if (response?.code == 0 && response?.data) {
      setSubServices(subServices?.filter((e) => e.id !== id));
      toast.success(response?.message);
    }
    setDeleteDetails({ id: id, loading: false });
  };

  const handleChangeStopStatus = async (id: number, checked: boolean) => {
    const subService = subServices?.find((e) => e.id == id);
    if (subService) {
      subService.stopEnabled = checked;
      setSubServices(orderBy([...subServices.filter((e) => e.id !== id), subService],"id"));
      const response = await patchSubService(id, { stopEnabled: checked });
      if (!response?.isServerOn) {
        toast.error(t(response?.serverOffMessage));
        return;
      }
      if (response?.code == 0 && response?.data) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    }
  };

  return (
    <Sheet open={visible} onOpenChange={onVisibleChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("titles.show_details")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          {serviceDetailsValue?.serviceImg && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-secondary/20">
              <Image
                src={serviceDetailsValue?.serviceImg ?? ""}
                alt={
                  isRtl
                    ? serviceDetailsValue?.arDesc
                    : serviceDetailsValue?.enDesc
                }
                objectFit="contain"
                fill
              />
            </div>
          )}
          <SingleRow
            icon={<LockIcon />}
            label={t("labels.stopped")}
            value={<ActiveBudge isActive={data?.stopEnabled} />}
          />
          <SingleRow
            icon={<CalendarClock />}
            label={t("labels.crtd_at")}
            value={
              serviceDetailsValue?.crtdAt ? (
                dateFormat(serviceDetailsValue?.crtdAt, "dd/mm/yyyy hh:MM TT")
              ) : (
                <></>
              )
            }
          />
          <SingleRow
            icon={<CalendarClock />}
            label={t("labels.last_update_at")}
            value={
              serviceDetailsValue?.lastUpdateAt ? (
                dateFormat(
                  serviceDetailsValue?.lastUpdateAt,
                  "dd/mm/yyyy hh:MM TT"
                )
              ) : (
                <></>
              )
            }
          />
          <SingleRow
            icon={<InfoIcon />}
            label={t("labels.en_desc")}
            mode="col"
            value={serviceDetailsValue?.enDesc}
          />
          <SingleRow
            icon={<InfoIcon />}
            label={t("labels.ar_desc")}
            mode="col"
            value={serviceDetailsValue?.arDesc}
          />
          <TitleHeader             
           className="h-12 rounded-none"
           title={"الخدمات الفرعية"} />
          <div className="flex flex-col gap-2">
            {isPending
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="p-2 rounded-md w-full h-[100px]"
                  />
                ))
              : subServices &&
                subServices?.length > 0 &&
                subServices?.map((e) => (
                  <SubServiceDetailsCard
                    key={e.id}
                    subService={e as z.infer<typeof IEditSubService>}
                    loading={
                      e.id == deleteDetails?.id ? deleteDetails?.loading : false
                    }
                    onStatusChange={handleChangeStopStatus}
                    onRemoveSubService={handleRemoveSubService}
                  />
                ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ServiceDetailsSheet;
