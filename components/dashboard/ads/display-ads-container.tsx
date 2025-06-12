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
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import {
  APIAdsResponseType,
} from "@/lib/types/api/api-type";
import { cn } from "@/lib/utils";
import { convertFiletimeToDate } from "@/lib/utils/stuff-client";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import AdsDetailsSheet from "./ads-details-sheet";
import AdsForm from "./ads-form";
import UpdateAdsForm from "./update-ads-form";

const DisplayAdsContainer = () => {
  const { isPending, result, ads, getAds, deleteAds } = useAdsStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [createIsFormOpen,setCreateIsFormOpen] = React.useState<boolean>(false);
  const [isUpdateFormOpen,setUpdateIsFormOpen] = React.useState<boolean>(false);
  const [deleteAdsd, setDeleteAdsId] = React.useState<number | undefined>(
    undefined
  );
  const [adsDetails,setAdsDetails] = React.useState<APIAdsResponseType | undefined>(undefined);

  const fetchData = async () => {
    await getAds(paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  const cols = React.useMemo<ColumnDef<APIAdsResponseType>[]>(() => {
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
        accessorKey: "arTitle",
        header: t("labels.ar_desc"),
      },
      {
        accessorKey: "enTitle",
        header: t("labels.en_desc"),
      },
      {
        accessorKey: "showInMainSlider",
        header: t("labels.show_in_main_slider"),
        cell: ({ row }) => {
          const data = row.original;
          return <ActiveBudge isActive={data?.showInMainSlider} />;
        },
      },
      {
        accessorKey: "showInSubSlider",
        header: t("labels.show_in_sub_slider"),
        cell: ({ row }) => {
          const data = row.original;
          return <ActiveBudge isActive={data?.showInSubSlider} />;
        },
      },
      {
        accessorKey: "endExclusiveTimeStamp",
        header: t("labels.end_exclusive_time_stamp"),
        cell: ({ row }) => {
          const data = row.original;
          return data.endExclusiveTimeStamp ? (
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
          ) : (
            <></>
          );
        },
      },
      {
        accessorKey: "endTimeStamp",
        header: t("labels.end_time_stamp"),
        cell: ({ row }) => {
          const data = row.original;
          return data.endTimeStamp ? (
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
          ) : (
            <></>
          );
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
              <AdsDetailsSheet data={data} />
                            <Button 
              variant="destructive"
              onClick={()=>{
                setAdsDetails(data);
                setUpdateIsFormOpen(true);
              }}>
                <Edit/>
              </Button>
              <Button
                onClick={() => {
                  setVisible(true);
                  setDeleteAdsId(data.id);
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
  }, [ads, paginate]);

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
          itemTitle: "routes.ads",
        },
      ]}
    >
      <DataTable isLoading={isPending} columns={cols} data={ads ?? []} />

      <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteAdsId(undefined);
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
                if (deleteAdsd) {
                  const result = await deleteAds(deleteAdsd);

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
                setDeleteAdsId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <AdsForm 
      isOpen={createIsFormOpen}
      onClose={()=>setCreateIsFormOpen(false)}
      onSubmit={async ()=>{
        await fetchData()
      }}
      />
     <UpdateAdsForm 
      isOpen={isUpdateFormOpen}
      onClose={()=>setUpdateIsFormOpen(false)}
      adsDetails={adsDetails}
      onSubmit={async ()=>{
        await fetchData()
      }}
      />
    </PageWrapper>
  );
};

export default DisplayAdsContainer;
