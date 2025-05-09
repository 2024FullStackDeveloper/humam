"use client";
import DataTable from "@/components/common/data-table";
import SingleRow from "@/components/common/single-row";
import TitleHeader from "@/components/common/title-header";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APICategoryResponseType, CategoryTypes } from "@/lib/types/api/api-type";
import { DropdownType } from "@/lib/types/common-type";
import { ColumnDef } from "@tanstack/react-table";
import { orderBy } from "lodash";
import { BookCheck, Info } from "lucide-react";
import React from "react";

const CategoryDetailsSheet = ({data}:{data:APICategoryResponseType})=>{
    const {t} = useLocalizer();
    const values = React.useDeferredValue(data?.subs);

    const cols: ColumnDef<DropdownType<CategoryTypes>>[] = [
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
      ];

    return (
        <Sheet>
        <SheetTrigger asChild >
          <Button variant="default" title={t("tooltips.details_show")}>
            <Info />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("titles.category_details")}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 py-4">
            <SingleRow
            icon={<BookCheck/>}
            label={t("labels.ar_desc")}
            value={data.arDesc}
            />
            <SingleRow
            icon={<BookCheck/>}
            label={t("labels.en_desc")}
            value={data.enDesc}
            />
            <TitleHeader
            className="h-12 rounded-none"
            title={t("labels.subs")}
            />
           <DataTable columns={cols} data={values ? orderBy(values,"orderValue","asc") : []} />
          </div>
        </SheetContent>
      </Sheet>
    )
};
export default CategoryDetailsSheet;