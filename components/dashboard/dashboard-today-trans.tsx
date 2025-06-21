"use client";

import useLocalizer from "@/lib/hooks/use-localizer";
import DecorationBox from "../common/decoration-box";
import React from "react";
import { ColumnDef } from "@tanstack/table-core";
import {
  APITransactionResponseType,
} from "@/lib/types/api/api-type";
import SortButton from "../common/sort-button";
import dateFormat from "dateformat";
import DataTable from "../common/data-table";
import { useTransactionsStore } from "@/lib/features/transactions/use-transactions-store";
import { Button } from "../ui/button";
import TruncatedSpan from "../common/truncated-span";
import { Badge } from "../ui/badge";
import OrderDetailsSheet from "./transcations/display-order-details-sheet";

const DashboardTodayTrans = () => {
  const { t } = useLocalizer();
  const { isPending, transactions, getTransactions } = useTransactionsStore();
  const [orderId, setOrderId] = React.useState<number | undefined>(undefined);
  const [visible, setVisible] = React.useState<boolean>(false);

  const fetchData = async () => {
    const currentDate = new Date(Date.now());
    const currentDateString = dateFormat(currentDate, "yyyy-mm-dd");

    await getTransactions({
      filters: [
        {
          field: "crtdAt",
          operator: "greaterthanorequal",
          value: `${currentDateString}`,
          logic: "and",
        },
        {
          field: "crtdAt",
          operator: "lessthanorequal",
          value: `${currentDateString}`
        },
      ],
    });
  };

  React.useEffect(() => {
    fetchData();
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
    ];
  }, [transactions]);

  return (
    <DecorationBox
      headerContent={t("titles.today_trans")}
      contentClassName="h-72 w-full"
      refreshEnabled
      onRefreshClick={async () => {
        await fetchData();
      }}
    >
      <div className="overflow-y-auto w-full max-h-[400px]">
        <DataTable
          isLoading={isPending}
          columns={cols}
          data={transactions ?? []}
        />
      </div>

    <OrderDetailsSheet 
      orderId={orderId ?? 0}
      visible={visible}
      onClose={()=>{
        setVisible(false);
        setOrderId(undefined);
      }}

      />
    </DecorationBox>
  );
};

export default DashboardTodayTrans;
