"use client";

import useLocalizer from "@/lib/hooks/use-localizer";
import DecorationBox from "../common/decoration-box";
import React from "react";
import { ColumnDef } from "@tanstack/table-core";
import { APIUserProfileType } from "@/lib/types/api/api-type";
import SortButton from "../common/sort-button";
import ActiveBudge from "../common/active-budge";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import DataTable from "../common/data-table";
import { orderBy } from "lodash";

const DashboardOnlineProviders = () => {
  const { t } = useLocalizer();
  const { filterUserProfiles } = useUsersStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataTable, setDataTable] = React.useState<APIUserProfileType[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    setDataTable([]);
    try {
      const response = await filterUserProfiles({
        filters: [
          {
            field: "isOnline",
            operator: "equal",
            value: true,
            logic:"and"
          },
          {
            field: "role",
            operator: "contains",
            value: "worker",
            logic:"or"
          },
        {
            field: "role",
            operator: "contains",
            value: "organization"
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
        accessorKey: "isOnline",
        header: t("labels.is_online"),
        cell: ({ row }) => {
          return <ActiveBudge isActive={row.original?.isOnline ?? false} />;
        },
      }, 
        {
        accessorKey: "isActive",
        header: t("labels.avaliable"),
        cell: ({ row }) => {
          return <ActiveBudge isActive={row.original?.isActive ?? false} />;
        },
      }, 
    ];
  }, [dataTable]);

  return (
    <DecorationBox
      headerContent={t("titles.online_providers")}
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

export default DashboardOnlineProviders;
