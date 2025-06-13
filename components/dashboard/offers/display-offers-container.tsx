"use client";

import ActiveBudge from "@/components/common/active-budge";
import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAdsStore } from "@/lib/features/ads/use-ads-store";
import { useOffersStore } from "@/lib/features/offers/use-offers-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import {
  APIAdsResponseType,
  APIOfferResponseType,
} from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { convertFiletimeToDate } from "@/lib/utils/stuff-client";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Edit, Info, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import OfferDetailsSheet from "./offer-details-sheet";
import OfferForm from "./offer-form";
import UpdateOfferForm from "./update-offer-form";


const DisplayOffersContainer = () => {
  const { isPending, result, offers , getOffers , deleteOffer} = useOffersStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [createIsFormOpen,setCreateIsFormOpen] = React.useState<boolean>(false);
  const [isUpdateFormOpen,setUpdateIsFormOpen] = React.useState<boolean>(false);
  const [deleteOfferId, setDeleteOfferId] = React.useState<number | undefined>(
    undefined
  );
  const [offerDetails,setOfferDetails] = React.useState<APIOfferResponseType | undefined>(undefined);
  const [isSheetOpen,setIsSheetOpen] = React.useState<boolean>(false);
  const fetchData = async () => {
    await getOffers(paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  const cols = React.useMemo<ColumnDef<APIOfferResponseType>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label="#"
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
      },
      {
        accessorKey: "arDesc",
        header: t("labels.ar_desc"),
      },
      {
        accessorKey: "enDesc",
        header: t("labels.en_desc"),
      },
      {
        accessorKey: "discountRate",
        header: t("labels.discount_rate"),
        cell: ({ row }) => {
          const data = row.original;
          return data?.discountRate?.toString() + "%";
        },
      },
      {
        accessorKey: "stopEnabled",
        header: t("labels.stopped"),
        cell: ({ row }) => {
          const data = row.original;
          return <ActiveBudge isActive={data?.stopEnabled} />;
        },
      },
      {
        accessorKey: "crtdAt",
        header: t("labels.crtd_at"),
        cell: ({ row }) => {
          const data = row.original;
          return data.crtdAt ? (
            <bdi>{dateFormat(data.crtdAt, "dd/mm/yyyy hh:MM TT")}</bdi>
          ) : (
            <></>
          );
        },
      },
      {
        accessorKey: "lastUpdateAt",
        header: t("labels.last_update_at"),
        cell: ({ row }) => {
          const data = row.original;
          return data.lastUpdateAt ? (
            <bdi>{dateFormat(data.lastUpdateAt, "dd/mm/yyyy hh:MM TT")}</bdi>
          ) : (
            <></>
          );
        },
      },
      {
        id: "actions",
        header: t("labels.actions"),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex flex-row items-center justify-center gap-2">
            <Button variant="default" title={t("tooltips.details_show")}
            onClick={()=>{
            setOfferDetails(data);
            setIsSheetOpen(true);
            }}
            >
             <Info />
           </Button>
            <Button 
              variant="destructive"
              onClick={()=>{
                setOfferDetails(data);
                setUpdateIsFormOpen(true);
              }}>
                <Edit/>
              </Button>
              <Button
                onClick={() => {
                  setVisible(true);
                  setDeleteOfferId(data.id);
                }}
                variant="dangerOutline"
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [offers, paginate]);

  return (
    <PageWrapper
      paginationOptions={{
        pagesCount: result?.result?.data?.numberOfPages,
        itemCount: result?.result?.data?.count,
        size: paginate?.size ?? 50,
        page: paginate?.page ?? 1,
      }}
      onRefresh={async () => {
        await fetchData();
      }}
      onAdd={() => {
        setCreateIsFormOpen(true)
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.offers",
        },
      ]}
    >
      <DataTable isLoading={isPending} columns={cols} data={offers ?? []} />
      <OfferDetailsSheet 
      data={offerDetails} 
      isOpen={isSheetOpen} 
      onClose={()=>{
        setIsSheetOpen(false)
      }}/>
      <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteOfferId(undefined);
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
                if (deleteOfferId) {
                  const result = await deleteOffer(deleteOfferId);

                  if (!result?.isServerOn) {
                    toast.error(t(result?.serverOffMessage));
                    return;
                  }
                  if (result?.code == 0 && result) {
                    toast.success(result?.message);
                    await fetchData();
                    setVisible(false);
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
                setDeleteOfferId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OfferForm 
      isOpen={createIsFormOpen}
      onClose={()=>{
        setCreateIsFormOpen(false);
      }}
      onSubmit={async ()=>{
        await fetchData()
      }}
      />


      <UpdateOfferForm 
      details={offerDetails}
      isOpen={isUpdateFormOpen}
      onClose={()=>{
        setUpdateIsFormOpen(false);
      }}
      onSubmit={async ()=>{
        await fetchData()
      }}
      />

    </PageWrapper>
  );
};

export default DisplayOffersContainer;
