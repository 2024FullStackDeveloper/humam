"use client";
import ActiveBudge from "@/components/common/active-budge";
import DataTable from "@/components/common/data-table";
import SingleRow from "@/components/common/single-row";
import TitleHeader from "@/components/common/title-header";
import TruncatedSpan from "@/components/common/truncated-span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APIAdsResponseType, APIProfileType } from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { convertFiletimeToDate } from "@/lib/utils/stuff-client";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import {
  Calendar,
  ImageIcon,
  Info,
  Mail,
  MapPin,
  Phone,
  UserSquare,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const AdsDetailsSheet = ({ data }: { data: APIAdsResponseType }) => {
  const { t, isRtl } = useLocalizer();

  const cols = React.useMemo((): ColumnDef<APIProfileType>[] => {
    return [
      {
        accessorKey: "id",
        header: "#",
      },
      {
        accessorKey: "name",
        header: t("labels.name"),
        cell: ({ row }) => {
          return <TruncatedSpan maxLength={20} text={row.original.name} />;
        },
      },
      {
        accessorKey: "isCompany",
        header: t("labels.is_company"),
        cell: ({ row }) => {
          return <ActiveBudge isActive={row.original?.isCompany} />;
        },
      },
      {
        id: "actions",
        header: t("labels.actions"),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex flex-row items-center justify-center gap-2">
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button>
                    <Info />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px]">
                  <div className="flex flex-col gap-2 items-center">
                    {data?.personImg && (
                      <div className="flex flex-col items-center justify-center p-2 w-full">
                        <Avatar className="h-14 w-14 bg-gray-50">
                          <AvatarImage src={data?.personImg ?? ""} />
                          <AvatarFallback>
                            {data?.name?.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <Separator className="my-2 w-full" />
                      </div>
                    )}
                    <SingleRow
                      icon={<UserSquare size={16} />}
                      label={t("labels.name")}
                      value={data?.name}
                    />
                    <SingleRow
                      icon={<Mail size={16} />}
                      label={t("labels.email")}
                      value={
                        <TruncatedSpan
                          maxLength={20}
                          text={data?.email ?? ""}
                        />
                      }
                    />
                    <SingleRow
                      icon={<Phone size={16} />}
                      label={t("labels.phone_number")}
                      value={data?.phoneNumber}
                    />
                    <SingleRow
                      icon={<MapPin size={16} />}
                      label={t("labels.city")}
                      value={isRtl ? data?.city?.arDesc : data?.city?.enDesc}
                    />
                    <SingleRow
                      icon={<MapPin size={16} />}
                      label={t("labels.address")}
                      value={
                        <TruncatedSpan
                          maxLength={30}
                          text={
                            isRtl
                              ? data?.arAddress ?? ""
                              : data?.enAddress ?? ""
                          }
                        />
                      }
                    />
                    <SingleRow
                      icon={<Info size={16} />}
                      label={t("labels.is_active")}
                      value={<ActiveBudge isActive={data?.isActive} />}
                    />
                    <SingleRow
                      icon={<Info size={16} />}
                      label={t("labels.is_online")}
                      value={<ActiveBudge isActive={data?.isOnline} />}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          );
        },
      },
    ];
  }, [data]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" title={t("tooltips.details_show")}>
          <Info />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("titles.show_details")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          {data?.background && (
            <SingleRow
              mode="col"
              icon={<ImageIcon />}
              label={t("labels.background")}
              value={
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-secondary/20">
                  <Image
                    src={data?.background ?? ""}
                    alt={isRtl ? data?.arTitle : data?.enTitle}
                    objectFit="contain"
                    fill
                  />
                </div>
              }
            />
          )}
          {data?.thumbnail && (
            <SingleRow
              mode="col"
              icon={<ImageIcon />}
              label={t("labels.thumbnail")}
              value={
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-secondary/20">
                  <Image
                    src={data?.thumbnail ?? ""}
                    alt={isRtl ? data?.arTitle : data?.enTitle}
                    objectFit="contain"
                    fill
                  />
                </div>
              }
            />
          )}
          <SingleRow
            mode="col"
            icon={<Info />}
            label={t("labels.ar_desc")}
            value={data.arTitle}
          />
          <SingleRow
            icon={<Info />}
            mode="col"
            label={t("labels.ar_content")}
            value={data?.arContent}
          />
          <SingleRow
            mode="col"
            icon={<Info />}
            label={t("labels.en_desc")}
            value={data.enTitle}
          />
          <SingleRow
            icon={<Info />}
            mode="col"
            label={t("labels.en_content")}
            value={data?.enContent}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.show_in_main_slider")}
            value={<ActiveBudge isActive={data?.showInMainSlider} />}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.show_in_sub_slider")}
            value={<ActiveBudge isActive={data?.showInSubSlider} />}
          />


          <SingleRow
            icon={<Info />}
            label={t("labels.stopped")}
            value={<ActiveBudge isActive={data?.stopEnabled} />}
          />
          

          {data?.endExclusiveTimeStamp && (
            <SingleRow
              icon={<Calendar />}
              mode="row"
              label={t("labels.end_exclusive_time_stamp")}
              value={
                <bdi
                  className={cn(
                    convertFiletimeToDate(data?.endExclusiveTimeStamp) <=
                      new Date(Date.now()) && "line-through text-danger"
                  )}
                >
                  {dateFormat(
                    convertFiletimeToDate(data?.endExclusiveTimeStamp),
                    "dd/mm/yyyy hh:MM TT"
                  )}
                </bdi>
              }
            />
          )}

          <SingleRow
            icon={<Calendar />}
            mode="row"
            label={t("labels.crtd_at")}
            value={
              <bdi>
                {data?.crtdAt ? (
                  dateFormat(data?.crtdAt, "dd/mm/yyyy hh:MM TT")
                ) : (
                  <></>
                )}
              </bdi>
            }
          />

          <SingleRow
            icon={<Calendar />}
            mode="row"
            label={t("labels.last_update_at")}
            value={
              <bdi>
                {data?.lastUpdateAt ? (
                  dateFormat(data?.lastUpdateAt, "dd/mm/yyyy hh:MM TT")
                ) : (
                  <></>
                )}
              </bdi>
            }
          />

          {data?.endTimeStamp && (
            <SingleRow
              icon={<Calendar />}
              mode="row"
              label={t("labels.end_time_stamp")}
              value={
                <bdi
                  className={cn(
                    convertFiletimeToDate(data?.endTimeStamp) <=
                      new Date(Date.now()) && "line-through text-danger"
                  )}
                >
                  {dateFormat(
                    convertFiletimeToDate(data?.endTimeStamp),
                    "dd/mm/yyyy hh:MM TT"
                  )}
                </bdi>
              }
            />
          )}


          <TitleHeader
            className="h-12 rounded-none"
            title={t("labels.providers")}
          />
          <DataTable
            ignorePagination
            columns={cols}
            data={data?.serviceProviders ?? []}
          />
        </div>
      </SheetContent>

    

    </Sheet>
  );
};
export default AdsDetailsSheet;
