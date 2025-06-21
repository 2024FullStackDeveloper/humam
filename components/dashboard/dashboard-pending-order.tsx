"use client";

import useLocalizer from "@/lib/hooks/use-localizer";
import DecorationBox from "../common/decoration-box";
import NoDataBox from "../common/no-data-box";
import React from "react";
import { ColumnDef } from "@tanstack/table-core";
import { APIUserProfileType } from "@/lib/types/api/api-type";
import SortButton from "../common/sort-button";
import ActiveBudge from "../common/active-budge";
import dateFormat from "dateformat";
import AccountStatusButton from "./users/account-status-button";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import DataTable from "../common/data-table";
import { toast } from "sonner";
import { orderBy } from "lodash";

const DashboardPendingOrder = () => {
  const { t } = useLocalizer();
  const { filterUserProfiles , changeStatus} = useUsersStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataTable, setDataTable] = React.useState<APIUserProfileType[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    setDataTable([]);
    try {
      const response = await filterUserProfiles({
        filters: [
          {
            field: "profileStatus",
            operator: "contains",
            value: "Pending",
          },
        ],
      });

      if (response?.code === 0 && response?.data) {
        setDataTable(orderBy(response.data ?? [],"profileId"));
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const cols = React.useMemo<ColumnDef<APIUserProfileType>[]>(() => {
    return [
      {
        accessorKey: "profileId",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.profile_id")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
      },
      {
        accessorKey: "fullName",
        header: t("labels.name"),
      },
      {
        accessorKey: "role",
        header: t("labels.role"),
        cell: ({ row }) => {
          const role = row.original?.role;
          if (!role) return <></>;
          return (
            <span className="text-primary font-bold">{t(`roles.${role}`)}</span>
          );
        },
      },
      {
        accessorKey: "crtdAt",
        header: t("labels.crtd_at"),
        cell: ({ row }) => {
          return row?.original?.crtdAt ? (
            <bdi>
              {dateFormat(row?.original?.crtdAt ?? "", "dd/mm/yyyy hh:MM TT")}
            </bdi>
          ) : (
            <></>
          );
        },
      },

      {
        id: "actions",
        header: t("labels.account_status"),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <AccountStatusButton
              role={data.role}
              status={data.profileStatus}
              onClick={async (_, stausCode) => {
                const result = await changeStatus({
                  profileId: data.profileId,
                  statusCode: stausCode,
                });
                if (result) {
                  setDataTable(orderBy(dataTable?.filter(e=>e.profileId !== data.profileId) ?? [],"profileId"));
                  await fetchData();
                }
              }}
            />
          );
        },
      },
    ];
  }, [dataTable]);

  return (
    <DecorationBox
      headerContent={t("titles.pending_orders")}
      contentClassName="h-72 w-full"
      refreshEnabled
      onRefreshClick={async ()=>{
        await fetchData();
      }}
    >
      <div className="overflow-y-auto w-full max-h-[400px]">
      <DataTable isLoading={isLoading} columns={cols} data={dataTable ?? []} />
      </div>
    </DecorationBox>
  );
};

export default DashboardPendingOrder;
