"use client";
import ActiveBudge from "@/components/common/active-budge";
import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import SingleRow from "@/components/common/single-row";
import TitleHeader from "@/components/common/title-header";
import TruncatedSpan from "@/components/common/truncated-span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useOffersStore } from "@/lib/features/offers/use-offers-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import {APIOfferProvider, APIOfferResponseType, APIProfileType } from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { convertFiletimeToDate } from "@/lib/utils/stuff-client";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { orderBy } from "lodash";
import {
  Calendar,
  Edit,
  Ellipsis,
  ImageIcon,
  Info,
  Mail,
  MapPin,
  PercentCircle,
  Phone,
  Trash,
  UserSquare,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import OfferProviderDetailsDlg from "./offer-provider-details-dlg";
import UpdateOfferProviderServicesForm from "./update-offer-provider-services-form";

const OfferDetailsSheet = ({ data , isOpen , onClose }: { 
  data?: APIOfferResponseType ,   
  isOpen: boolean;
  onClose: () => void; }) => {

  const [isLoading,setIsLoading] = React.useState<boolean>(false);
  const { t, isRtl } = useLocalizer();
  const {getOfferProviders , deleteOfferProvider} = useOffersStore();
  const [providers,setProviders]=React.useState<Array<APIOfferProvider>>([]);
  const [visible,setVisible] = React.useState<boolean>(false);
  const [deleteId,setDeleteId] = React.useState<number | undefined>(undefined);
  const [offerProviderDetails,setOfferProviderDetails] = React.useState<APIOfferProvider | undefined>(undefined);
  const [isOfferProviderOpen,setIsOfferProviderOpen] = React.useState<boolean>(false);
  const [isUpdateOfferProviderOpen,setIsUpdateOfferProviderOpen] = React.useState<boolean>(false);


  const fetchProviders = async ()=>{
    setIsLoading(true);
    if(data?.id){
      const response = await getOfferProviders(data?.id);
      if(response?.code == 0){
        setProviders(orderBy(response?.data ?? [],"id"));
      }
    }
    setIsLoading(false);
  }

  React.useEffect(()=>{
    fetchProviders();
  },[data])

  const cols = React.useMemo((): ColumnDef<APIOfferProvider>[] => {
    return [
      {
        accessorKey: "id",
        header: "#",
      },
      {
        accessorKey: "name",
        header: t("labels.name"),
        cell: ({ row }) => {
          return <TruncatedSpan maxLength={20} text={row.original.name ?? ""} />;
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
                     <Ellipsis />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <Button onClick={()=>{
                      setOfferProviderDetails(data)
                      setIsOfferProviderOpen(true);
                    }}>
                      <Info/>
                    </Button>
                    <Button onClick={()=>{
                      setOfferProviderDetails(data);
                      setIsUpdateOfferProviderOpen(true);
                    }} variant="destructive">
                      <Edit/>
                    </Button>
                    <Button variant="dangerOutline"
                    onClick={()=>{
                      setDeleteId(data?.id)
                      setVisible(true);
                    }}
                    >
                      <Trash/>
                    </Button>
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
    <><Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("titles.show_details")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          {data?.backgroundImg && (
            <SingleRow
              mode="col"
              icon={<ImageIcon />}
              label={t("labels.background")}
              value={
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-secondary/20">
                  <Image
                    src={data?.backgroundImg ?? ""}
                    alt={isRtl ? data?.arDesc : data?.enDesc}
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
            value={data?.arDesc}
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
            value={data?.enDesc}
          />
          <SingleRow
            icon={<Info />}
            mode="col"
            label={t("labels.en_content")}
            value={data?.enContent}
          />


           <SingleRow
            icon={<PercentCircle />}
            label={t("labels.discount_rate")}
            value={data?.discountRate?.toString() + "%"}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.include_spares")}
            value={<ActiveBudge isActive={data?.includeSpares} />}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.include_transportation")}
            value={<ActiveBudge isActive={data?.includeTransportation} />}
          />


          <SingleRow
            icon={<Info />}
            label={t("labels.stopped")}
            value={<ActiveBudge isActive={data?.stopEnabled} />}
          />
          

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

          {data?.startTimeStamp && (
            <SingleRow
              icon={<Calendar />}
              mode="row"
              label={t("labels.start_time_stamp")}
              value={
                <bdi
                  className={cn(
                    convertFiletimeToDate(data?.startTimeStamp) <=
                      new Date(Date.now()) && "line-through text-danger"
                  )}
                >
                  {dateFormat(
                    convertFiletimeToDate(data?.startTimeStamp),
                    "dd/mm/yyyy hh:MM TT"
                  )}
                </bdi>
              }
            />
          )}

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
            isLoading={isLoading}
            columns={cols}
            data={providers}
          />
        </div>
      </SheetContent>
    </Sheet>
    <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteId(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("titles.delete_confirmation")}</DialogTitle>
            <Separator className="my-3" />
            <DialogDescription>
              {t("paragraphs.delete_confirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <form
              action={async () => {
                if (deleteId) {
                  const result = await deleteOfferProvider(data?.id ?? 0 ,deleteId);

                  if (!result?.isServerOn) {
                    toast.error(t(result?.serverOffMessage));
                    return;
                  }
                  if (result?.code == 0 && result) {
                    toast.success(result?.message);
                    setProviders([...providers?.filter(e=>e.id !== deleteId) ?? []])
                    setVisible(false);
                    setDeleteId(undefined);
                  } else {
                    toast.error(result?.message);
                  }
                }
              }}
            >
              <FormButton title={t("buttons.ok")} />
            </form>
            <Button
              onClick={() => {
                setVisible(false);
                setDeleteId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    <OfferProviderDetailsDlg 
    details={offerProviderDetails}
    isOpen={isOfferProviderOpen}
    onClose={()=>{
      setIsOfferProviderOpen(false);
      setOfferProviderDetails(undefined);
    }}
    />

    <UpdateOfferProviderServicesForm
    details={offerProviderDetails}
    isOpen={isUpdateOfferProviderOpen}
    onClose={()=>{ 
      setIsUpdateOfferProviderOpen(false);
      setOfferProviderDetails(undefined);
    }}
    />
    </>
  );
};
export default OfferDetailsSheet;
