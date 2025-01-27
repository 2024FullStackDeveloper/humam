"use client";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegionsStore } from "@/lib/features/regions/use-regions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APIRegionResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import RegionDetailsSheet from "./region-details-sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FormButton from "@/components/common/form-button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import usePaginate from "@/lib/hooks/use-paginate";

const DisplayRegionContainer = () => {
  const { t, isRtl } = useLocalizer();
  const { isPending, regions, code , result, message, isServerOn , serverOffMessage,  getRegions , deleteCityById } = useRegionsStore();
  const {paginate} = usePaginate();
  const [selectedCityList,setSelectedCityList] = React.useState<{regionId:number,cityId:number}[]>([]);
  const router = useRouter();


  const disabledComponent = React.useCallback((id:number) : boolean=>{
    return !selectedCityList?.some(e=>e.regionId == id)
  },[selectedCityList]);

  const getSelectedRegionCity = React.useCallback((id:number) : string=>{
    return selectedCityList?.find(e=>e.regionId == id)?.cityId?.toString() ?? "";
  },[selectedCityList]);

  async function fetchData() {
    await getRegions(paginate);
  }

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  const cols: ColumnDef<APIRegionResponseType>[] = [
    {
      accessorKey: "id",
      header: "#",
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
      accessorKey: "cities",
      header: t("labels.cities"),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Select value={selectedCityList?.find(e=>e.regionId == data.id)?.cityId?.toString()} onValueChange={(value)=>{
            setSelectedCityList([...selectedCityList.filter(e=>e.regionId !== data.id),{regionId:data.id,cityId: parseInt(value)}]);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue  placeholder={t("placeholders.city")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data.cities.map((e) => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {isRtl ? e.arDesc : e.enDesc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
            <RegionDetailsSheet data={data}/>
            <Button disabled={disabledComponent(data.id)} onClick={ () => {
              const cityId = getSelectedRegionCity(data.id);
              if(!cityId) return;
              router.push(`/dashboard/regions/update?id=${cityId}`);
            }} variant="destructive">
              <Edit />
            </Button>
            <Dialog>
            <DialogTrigger className="order-3" asChild>
            <Button  variant="dangerOutline" disabled={disabledComponent(data.id)}>
              <Trash2 />
            </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("titles.delete_confirmation")}</DialogTitle>
                <Separator className="my-3" />
                <DialogDescription>
                  {t("paragraphs.delete_confirmation")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <form action={async () => {

                    const cityResult = selectedCityList.find(e=>e.regionId == data.id)?.cityId;
                    if(cityResult){
                        const result = await deleteCityById(cityResult);
                
                        if(!isServerOn){
                            toast.error(t(serverOffMessage));
                            return;
                        }
                        if(code == 0 && result){
                            toast.success(message);
                            setSelectedCityList([...selectedCityList.filter(e=>e.regionId !== data.id)]);
                            await fetchData();
                        }else{
                            toast.error(message);
                        }
                    }

                }}>
                  <FormButton title={t("buttons.ok")} />
                </form>
                <Button onClick={() => {}} variant="secondary">
                  {t("buttons.cancel")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          </div>
        );
      },
    },
  ];

  return (
    <PageWrapper
      onRefresh={async () => {
        await fetchData();
      }}
      onAdd={()=>{
        router.push("/dashboard/regions/create")
      }}
      paginationOptions={{
        pagesCount: result?.result?.data?.numberOfPages,
        itemCount:result?.result?.data?.count,
        size:paginate?.size ?? 50,
        page:paginate?.page ?? 1
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.global_settings",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.regions_cities",
        },
      ]}
    >
        <DataTable isLoading={isPending} columns={cols} data={regions ?? []} />
    </PageWrapper>
  );
};
export default DisplayRegionContainer;
