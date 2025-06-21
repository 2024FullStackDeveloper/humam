"use client";

import ActiveBudge from "@/components/common/active-budge";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
import TruncatedSpan from "@/components/common/truncated-span";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransactionsStore } from "@/lib/features/transactions/use-transactions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import {
  APITransactionResponseType,
  APIWalletResponseType,
  InvoiceStatusTypes,
} from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import React from "react";
import TransactionDetailsSheet from "./transaction-details-sheet";
import WalletBox from "./wallet-box";
import OrderDetailsSheet from "./display-order-details-sheet";
import FormButton from "@/components/common/form-button";
import { DateTimePicker } from "@/components/common/date-time-picker";
import SelectList from "@/components/common/select-list";
import { BookA } from "lucide-react";
import { DropdownType } from "@/lib/types/common-type";

const DisplayTranscationsContainer = () => {
  const { isPending, result, transactions, getTransactions, getWallet } = useTransactionsStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const initial = {
    id: "",
    balance: 0,
    pendingProfit: 0,
    receivingProfit: 0,
  };

  const [wallet, setWallet] = React.useState<APIWalletResponseType>(initial);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [orderId,setOrderId] = React.useState<number | undefined>(undefined);
  const [visible,setVisible] = React.useState<boolean>(false);
  const [filter,setFilter] = React.useState<{transactionDate?:string | null , invoiceStatus? : InvoiceStatusTypes | null} | undefined>(undefined);

  const fetchData = async (query ?: any) => {
    await getTransactions(query || filter, paginate);
  };

  const fetchWalletData = async () => {
    setIsLoading(true);
    setWallet((await getWallet())?.data ?? initial);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  React.useEffect(() => {
    fetchWalletData();
  }, []);

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
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Button
              variant="destructive"
              title={t("tooltips.details_show")}
              onClick={() => {
                setOrderId(data?.orderId);
                setVisible(true);
              }}
            >
              {data?.orderId}
            </Button>
          );
        },
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
        cell: ({ row }) => {
          const data = row.original;
          return (
            <TruncatedSpan
              maxLength={25}
              text={data?.profits?.providerInfo?.name ?? ""}
            />
          );
        },
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
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Badge
              className="h-8 p-2 max-w-32 text-sm flex justify-center items-center"
              variant={
                data?.invoiceStatus == 1
                  ? "warningOutline"
                  : data?.invoiceStatus == 2
                  ? "successOutline"
                  : "dangerOutline"
              }
            >
              {data.invoiceStatus == 1
                ? "Pending"
                : data.invoiceStatus == 2
                ? "Paid"
                : "Canceled"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "paymentMethod",
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
        cell: ({ row }) => {
          const data = row.original;
          return (
            <span className="font-bold">
              {data?.paymentMethod == 1 ? "Cash" : "Card"}
            </span>
          );
        },
      },
      {
        accessorKey: "displayCurrencyIso",
        header: t("labels.display_currency_iso"),
      },
      {
        accessorKey: "serviceAmount",
        header: t("labels.service_amount"),
        cell: ({ row }) => {
          const data = row.original;
          return <span className="font-bold">{data?.serviceAmount}</span>;
        },
      },
      {
        accessorKey: "totalAmount",
        header: t("labels.total_amount"),
        cell: ({ row }) => {
          const data = row.original;
          return <span className="font-bold">{data?.totalAmount}</span>;
        },
      },
      {
        accessorKey: "customerReference",
        header: t("labels.customer_reference"),
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
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Badge
              className="h-8 p-2 max-w-32 text-sm flex justify-center items-center"
              variant={data?.status == 1 ? "destructive" : "successOutline"}
            >
              {data.status == 1 ? "Pending" : "Completed"}
            </Badge>
          );
        },
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
        accessorKey: "reviewAndApproved",
        header: t("labels.review_approve"),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <ActiveBudge isActive={data?.profits?.isTransfered ?? false} />
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
              <TransactionDetailsSheet 
               data={data} 
               onRefresh={async()=>{
                await fetchWalletData();
               }}
               />
            </div>
          );
        },
      },
    ];
  }, [transactions, paginate]);

  const invoiceStatusOptions = React.useMemo(() : Array<DropdownType<number>> => {
    return [
      { id: 1, arDesc : "معلقة"  , enDesc: "Pending" },
      { id: 2, arDesc : "مدفوعة"  , enDesc: "Paid" },
      { id: 3, arDesc : "ملغية"  , enDesc: "Canceled" },
    ];
  }, []);

  return (
    <PageWrapper
      paginationOptions={{
        pagesCount: result?.result?.data?.numberOfPages,
        itemCount: result?.result?.data?.count,
        size: paginate?.size ?? 50,
        page: paginate?.page ?? 1,
      }}
      filterable

      onFilterClosed={()=>{
        setFilter(undefined);
      }}
      filterComponents={
      <form action={async()=>{
          if(!filter) return;

          const filters : any  = [];
          if(filter?.transactionDate && filter?.invoiceStatus) {
            filters.push({
              field: "transactionDate",
              operator: "greaterthanorequal",
              value: filter?.transactionDate,
              logic:"and"
            });
            filters.push({
              field: "transactionDate",
              operator: "lessthanorequal",
              value: filter?.transactionDate,
              logic:"and"
            });
              filters.push({
              field: "invoiceStatus",
              operator: "equal",
              value: filter?.invoiceStatus,
            });
          }else if (filter.transactionDate) {
            filters.push({
              field: "transactionDate",
              operator: "greaterthanorequal",
              value: filter?.transactionDate,
              logic:"and"
            });
            filters.push({
              field: "transactionDate",
              operator: "lessthanorequal",
              value: filter?.transactionDate,
            });

          }else if (filter.invoiceStatus) {
            filters.push({
              field: "invoiceStatus",
              operator: "equal",
              value: filter?.invoiceStatus,
            });
          }

          await fetchData({filters});
          
        }} className="flex flex-col md:flex-row flex-wrap md:justify-between md:items-center gap-2">
          <div className="flex flex-col md:flex-row gap-2">
        <DateTimePicker
          onChange={(value) => {
            setFilter((prev) => ({
              ...prev,
              transactionDate: value ? dateFormat(value, "yyyy-mm-dd") : undefined,
            }));
          }}
          label={t("labels.transaction_date")}                       
        />
         <SelectList
          label={t("labels.invoice_status")}
          options={invoiceStatusOptions ?? []}
          prefixicon={<BookA />}
          onValueChange={(value) => {
              setFilter((prev) => ({
              ...prev,
              invoiceStatus: value ? (parseInt(value) as InvoiceStatusTypes) : undefined,
            }));
          }}
        />
          </div>
          <FormButton className="mt-5" variant="destructive" title={t("buttons.search")}/>        
          </form>
      }
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
          disabled: true,
        },
        {
          itemTitle: "routes.transcations",
          disabled: true,
        },
      ]}
    >
      <div className="mb-4 grid grid-cols-1 xl:grid-cols-3 gap-2">
        <WalletBox
          loading={isLoading}
          title={t("titles.wallet_balance")}
          color="blue"
          balance={wallet?.balance ?? 0}
        />

        <WalletBox
          loading={isLoading}
          title={t("titles.pending_balance")}
          color="orange"
          balance={wallet?.pendingProfit ?? 0}
        />

        <WalletBox
          loading={isLoading}
          title={t("titles.receiving_balance")}
          color="green"
          balance={wallet?.receivingProfit ?? 0}
        />
      </div>

      <DataTable
        isLoading={isPending}
        columns={cols}
        data={transactions ?? []}
      />

      <OrderDetailsSheet 
      orderId={orderId ?? 0}
      visible={visible}
      onClose={()=>{
        setVisible(false);
        setOrderId(undefined);
      }}

      />
    </PageWrapper>
  );
};

export default DisplayTranscationsContainer;
