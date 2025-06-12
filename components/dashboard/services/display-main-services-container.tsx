"use client";

import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import { APIMainServiceResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Edit, Info, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import ServiceDetailsSheet from "./service-details-sheet";
import ServiceForm from "./service-form";
import { Service } from "@/lib/types/common-type";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import FormButton from "@/components/common/form-button";
import { orderBy } from "lodash";
import UpdateServiceForm from "./update-service-form";

const DisplayMainServicesContainer = () => {
  const { isPending, result, mainServices, getMainServices , patchMainService , deleteMainService} = useServicesStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const [sheetVisible,setSheetVisible] = React.useState<boolean>(false);
  const [serviceDetails,setServiceDetails] = React.useState<APIMainServiceResponseType | undefined>(undefined);
  const [isFormOpen,setIsFormOpen] = React.useState<boolean>(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [deleteVisible,setDeleteVisible] = React.useState<boolean>(false);
  const [deleteId,setDeleteId] = React.useState<number | undefined>(undefined);
  const [stopServices,setStopServices] = React.useState<Array<{
    id:number,
    checked:boolean
  }>>([]);

  const [stopServiceLoading,setStopServiceLoading] = React.useState<boolean>(false);
  const [services,setServices] = React.useState<Array<APIMainServiceResponseType> | undefined | null>([]);
  const [isUpdateFormOpen,setUpdateIsFormOpen] = React.useState<boolean>(false);
  const fetchData = async () => {
    await getMainServices(paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);


  React.useEffect(()=>{
    setServices(orderBy(mainServices ?? [],"id"));
  },[mainServices]);


  
  const handleChangeStopStatus = async (id:number , checked : boolean)=>{
    try{
    const response = await patchMainService(id,{stopEnabled:checked});
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      setServices(orderBy([...services?.filter(e=>e.id !== id) ?? [] , response?.data],"id"));
    } else {
      toast.error(response?.message);
    }
    }catch(e){
        console.log("error once updating stop status.",e)
    }
  };


  const cols = React.useMemo<ColumnDef<APIMainServiceResponseType>[]>(() => {
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
        accessorKey: "stopEnabled",
        header: t("labels.stopped"),
        cell: ({ row }) => {
          const data = row.original;
          return <Switch 
          disabled={stopServiceLoading}
          label={""} 
          checked={stopServices?.find(e=>e.id == data.id)?.checked ?? data?.stopEnabled} 
          onCheckedChange={async (checked)=>{
            setStopServiceLoading(true);
            setStopServices([...[...stopServices].filter(e=>e.id !== data.id),{id:data.id,checked}]);
            await handleChangeStopStatus(data.id,checked);
            setStopServiceLoading(false);
          }}
          />;
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
              <Button onClick={()=>{
                setServiceDetails(data);
                setSheetVisible(true);
              }}>
                <Info/>
              </Button>
              <Button 
              variant="destructive"
              onClick={()=>{
                setServiceDetails(data);
                setUpdateIsFormOpen(true);
              }}>
                <Edit/>
              </Button>
              <Button onClick={() => {
                setDeleteId(data.id);
                setDeleteVisible(true);
              }} variant="dangerOutline">
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [services,mainServices, stopServices, paginate,stopServiceLoading]);

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
       setIsFormOpen(true)
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.services",
        },
      ]}
    >
      <DataTable
        isLoading={isPending}
        columns={cols}
        data={services ?? []}
      />
        <ServiceDetailsSheet 
        data={serviceDetails}
        visible={sheetVisible}
        onVisibleChange={()=>setSheetVisible(false)}
        />

          <ServiceForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async ()=>{
            await fetchData();
          }}
          mode={editingService ? "edit" : "create"}
        />

        
          <UpdateServiceForm
          isOpen={isUpdateFormOpen}
          service={serviceDetails}
          onClose={() => setUpdateIsFormOpen(false)}
          onSubmit={async ()=>{
            await fetchData();
          }}
        />

      <Dialog
        open={deleteVisible}
        onOpenChange={() => {
          setDeleteVisible(false);
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
                  const result = await deleteMainService(deleteId);

                  if (!result?.isServerOn) {
                    toast.error(t(result?.serverOffMessage));
                    return;
                  }
                  if (result?.code == 0 && result) {
                    toast.success(result?.message);
                    await fetchData();
                    setDeleteVisible(false);
                  } else if (result?.code == 1){
                    toast.error(t("errors.unable_delete"));
                  }else {
                    toast.error(result?.message);
                  }
                }
              }}
            >
              <FormButton title={t("buttons.ok")} />
            </form>
            <Button
              onClick={() => {
                setDeleteVisible(false);
                setDeleteId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default DisplayMainServicesContainer;
