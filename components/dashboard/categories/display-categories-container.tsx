"use client";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useLocalizer from "@/lib/hooks/use-localizer";
import {
  APICategoryResponseType,
} from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import CategoryDetailsSheet from "./category-details-sheet";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import FormButton from "@/components/common/form-button";
import { useCategoryStore } from "@/lib/features/categories/use-categories-store";
import usePaginate from "@/lib/hooks/use-paginate";
const DisplayCatgoriesContainer = () => {
  const { t, isRtl } = useLocalizer();
  const {
    isPending,
    categories,
    result,
    getCategories,
    deleteSubCategory,
  } = useCategoryStore();
  const categoryValues = React.useDeferredValue(categories);
  const [selectedCategoryList, setSelectedCategoryist] = React.useState<
    { mainCategoryId: number; subCategoryId: number }[]
  >([]);

  const disabledComponent = React.useCallback(
    (id: number): boolean => {
      return !selectedCategoryList?.some((e) => e.mainCategoryId == id);
    },
    [selectedCategoryList]
  );
  const {paginate} = usePaginate();

  const getSelectedSubCategory = React.useCallback(
    (id: number): string => {
      return (
        selectedCategoryList
          ?.find((e) => e.mainCategoryId == id)
          ?.subCategoryId?.toString() ?? ""
      );
    },
    [selectedCategoryList]
  );

  const router = useRouter();

  async function fetchData() {
    await getCategories(paginate);
  }

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

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
          <Select
            value={selectedCategoryList
              ?.find((e) => e.mainCategoryId == data.id)
              ?.subCategoryId?.toString()}
            onValueChange={(value) => {
              setSelectedCategoryist([
                ...selectedCategoryList.filter(
                  (e) => e.mainCategoryId !== data.id
                ),
                { mainCategoryId: data.id, subCategoryId: parseInt(value) },
              ]);
            }}
          >
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
            <CategoryDetailsSheet data={data} />
            <Button
              disabled={disabledComponent(data.id)}
              onClick={() => {
                const subCategory = getSelectedSubCategory(data.id);
                router.push(`/dashboard/categories/update?id=${subCategory}`);
              }}
              variant="destructive"
            >
              <Edit />
            </Button>
            <Dialog>
              <DialogTrigger  className="order-3" asChild>
                <Button
                  disabled={disabledComponent(data.id)}
                  variant="dangerOutline"
                >
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
                  <form
                    action={async () => {
                      const selectedResult = selectedCategoryList.find((e) => e.mainCategoryId == data.id);

                      if (selectedResult) {
                        const result = await deleteSubCategory(selectedResult?.subCategoryId);

                        if (!result?.isServerOn) {
                          toast.error(t(result?.serverOffMessage));
                          return;
                        }
                        if (result.code == 0 && result) {
                          toast.success(result.message);
                          setSelectedCategoryist([
                            ...selectedCategoryList.filter((e) => e.mainCategoryId !== data.id),
                          ]);
                          await fetchData();
                        } else {
                          toast.error(result.message);
                        }
                      }
                    }}
                  >
                    <FormButton title={t("buttons.ok")} />
                  </form>
                  <Button onClick={() => {
                  }} variant="secondary">
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
        router.push("/dashboard/categories/create")
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
        pagesCount: result?.result?.data?.numberOfPages,
        itemCount: result?.result?.data?.count,
        size: paginate?.size ?? 50,
        page: paginate?.page ?? 1,
      }}
    >
        <DataTable
          isLoading={isPending}
          columns={cols}
          data={categoryValues ?? []}
        />
    </PageWrapper>
  );
};

export default DisplayCatgoriesContainer;
