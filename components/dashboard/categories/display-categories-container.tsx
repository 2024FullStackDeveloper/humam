"use client";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCategorysStore } from "@/lib/features/categories/use-categories-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APICategoryResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import CategoryDetailsSheet from "./category-details-sheet";
const DisplayCatgoriesContainer = () => {
  const { t, isRtl } = useLocalizer();
  const { isPending, categories, getCategories } = useCategorysStore();
  const categoryValues = React.useDeferredValue(categories);

  async function fetchData() {
    await getCategories();
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const cols: ColumnDef<APICategoryResponseType>[] = [
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
      accessorKey: "subs",
      header: t("labels.subs"),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <Select onValueChange={(value) => {}}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("placeholders.subs")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data.subs &&
                  data.subs.map((e) => (
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
              <CategoryDetailsSheet data={data}/>
              <Button onClick={ () => {
              }} variant="destructive">
                <Edit />
              </Button>
              <Dialog>
              <DialogTrigger className="order-3" asChild>
              <Button onClick={async () => {}} variant="dangerOutline">
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
      onRefresh={async ()=>{
         await fetchData();
     }}
     onFilter={()=>{

     }}
     onAdd={()=>{
        
     }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.settings",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.global_categories",
        },
      ]}
      paginationOptions={{
        pagesCount: 10,
        itemCount: 10,
        size: 4,
        page: 2,
      }}
    >
      <div className="p-5">
        <DataTable
          isLoading={isPending}
          columns={cols}
          data={categoryValues ?? []}
        />
      </div>
    </PageWrapper>
  );
};

export default DisplayCatgoriesContainer;
