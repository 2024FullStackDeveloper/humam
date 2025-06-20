"use client";

import ActiveBudge from "@/components/common/active-budge";
import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
import TruncatedSpan from "@/components/common/truncated-span";
import { Badge } from "@/components/ui/badge";
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
import { useContactUsStore } from "@/lib/features/contact-us/use-contact-us-store";
import { useTransactionsStore } from "@/lib/features/transactions/use-transactions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import { APIContactUsResponseType, APITransactionResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Info, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import TransactionDetailsSheet from "./transaction-details-sheet";


const DisplayTranscationsContainer = () => {
  const { isPending, result, transactions , getTransactions} = useTransactionsStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();


  const fetchData = async () => {
    await getTransactions(null,paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  const cols = React.useMemo<ColumnDef<APITransactionResponseType>[]>(() => {
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
        accessorKey: "orderId",
         header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.order_id")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
            const data = row.original;
            return <Button variant="destructive" title={t("tooltips.details_show")} onClick={()=>{

            }}>
              {data?.orderId}
            </Button>
        }
      },

      {
        accessorKey: "providerName",
         header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.provider")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
            const data = row.original;
            return <TruncatedSpan maxLength={25} text={data?.profits?.providerInfo?.name ?? ""}/>
        }
      },
      
      {
        accessorKey: "invoiceStatus",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.invoice_status")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
            const data = row.original;
            return <Badge className="h-8 p-2 max-w-32 text-sm flex justify-center items-center" variant={
                data?.invoiceStatus == 1  ? "warningOutline" :  data?.invoiceStatus == 2  ? "successOutline" : "dangerOutline"
            }>{data.invoiceStatus == 1 ? "Pending" : data.invoiceStatus == 2 ? "Paid" : "Canceled"}</Badge>
        }
      },  
      {
        accessorKey:"paymentMethod",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.payment_method")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
            const data = row.original;
            return <span className="font-bold">{data?.paymentMethod == 1 ? "Cash" : "Card"}</span> 
        }
      },
      {
        accessorKey:"displayCurrencyIso",
        header:t("labels.display_currency_iso")
      },
      {
        accessorKey:"serviceAmount",
        header:t("labels.service_amount"),
        cell:({row})=>{
            const data = row.original;
            return <span className="font-bold">{data?.serviceAmount}</span>
        }
        
      },
      {
        accessorKey:"totalAmount",
        header:t("labels.total_amount"),
        cell:({row})=>{
            const data = row.original;
            return <span className="font-bold">{data?.totalAmount}</span>
        }
      },
      {
        accessorKey:"customerReference",
        header:t("labels.customer_reference")
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.status")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
            const data = row.original;
            return <Badge className="h-8 p-2 max-w-32 text-sm flex justify-center items-center" variant={
              data?.status == 1 ? "destructive" : "successOutline"
            }>{data.status == 1 ? "Pending" : "Completed"}</Badge>
        }
      },  
      {
        accessorKey: "transactionDate",
        header: t("labels.transaction_date"),
        cell: ({ row }) => {
          const data = row.original;
          return data.transactionDate ? (
            <bdi>{dateFormat(data.transactionDate, "dd/mm/yyyy hh:MM TT")}</bdi>
          ) : (
            <></>
          );
        },
      },
      {
        accessorKey: "paymentDate",
        header: t("labels.payment_date"),
        cell: ({ row }) => {
          const data = row.original;
          return data.paymentDate ? (
            <bdi>{dateFormat(data.paymentDate, "dd/mm/yyyy hh:MM TT")}</bdi>
          ) : (
            <></>
          );
        },
      },
      {
        accessorKey:"reviewAndApproved",
        header:t("labels.review_approve"),
        cell:({row})=>{
            const data = row.original;
            return <ActiveBudge isActive={data?.profits?.isTransfered ?? false}/>
        }
      },
      {
        id: "actions",
        header: t("labels.actions"),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex flex-row items-center justify-center gap-2">
              <TransactionDetailsSheet data={data}/>
            </div>
          );
        },
      },
    ];
  }, [transactions, paginate]);

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
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.operations",
          disabled : true
        },
        {
          itemTitle: "routes.transcations",
          disabled : true

        },
      ]}
    >
      <DataTable isLoading={isPending} columns={cols} data={transactions ?? []} />

    </PageWrapper>
  );
};

export default DisplayTranscationsContainer;
