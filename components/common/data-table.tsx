import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useLocalizer from "@/lib/hooks/use-localizer";
import { cn } from "@/lib/utils";
import { Filter, Loader2, RefreshCcw } from "lucide-react";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useToggle } from "@uidotdev/usehooks";
import { Label } from "../ui/label";
import NoDataBox from "./no-data-box";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: false,
    enableRowSelection:true,
  });

  const { t, isRtl } = useLocalizer();

  return (
    <div className="max-w-full">
      <Table className="!table-auto border border-secondary/30">
        <TableHeader className="!bg-primary !text-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow  key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(isRtl ? "text-right" : "text-left","lg:font-bold ")}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
              className="hover:bg-secondary/20 hover:text-primary transition-all"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="!bg-transparent">
              <TableCell colSpan={columns.length} className="text-center">
                {isLoading ? (
                  <p className="flex flex-row justify-center items-center gap-2">
                    <Loader2 className="animate-spin" />{" "}
                    {t("paragraphs.loading")}{" "}
                  </p>
                ) : (
                  <NoDataBox/>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
