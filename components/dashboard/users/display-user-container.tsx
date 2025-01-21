"use client";

import ActiveBudge from "@/components/common/active-budge";
import { useUsersStore } from "@/lib/features/users/use-users-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APIUserResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import UserDetailsSheet from "./user-details-sheet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import React from "react";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";

const DisplayUserContainer = () => {
  const { t } = useLocalizer();
  const {
    getUsers,
    users,
    isPending,
    message,
    code,
    isServerOn,
    serverOffMessage,
    resetPassword,
    changeStatus,
  } = useUsersStore();

  const cols: ColumnDef<APIUserResponseType>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => {
        return row.index + 1;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: t("labels.phone_number"),
    },
    {
      accessorKey: "email",
      header: t("labels.email"),
    },
    {
      accessorKey: "isSuperUser",
      header: t("labels.is_super_user"),
      cell: ({ row }) => {
        const data = row.original;
        return <ActiveBudge isActive={data.isSuperUser} />;
      },
    },
    {
      accessorKey: "lastLogin",
      header: t("labels.last_log_in"),
      cell: ({ row }) => {
        const data = row.original;
        return data.lastLogin ? (
         <bdi>{dateFormat(data.lastLogin, "dd/mm/yyyy hh:MM TT")}</bdi> 
        ) : (
          <></>
        );
      },
    },
    {
      accessorKey: "lastLogOut",
      header: t("labels.last_log_out"),
      cell: ({ row }) => {
        const data = row.original;
        return data.lastLogOut ? (
            <bdi>{ dateFormat(data.lastLogOut, "dd/mm/yyyy hh:MM TT")}</bdi>
        ) : (
          <></>
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
            <UserDetailsSheet
              data={data}
              onChangeStatus={async (value) => {
                const result = await changeStatus(value);
                if (!isServerOn) {
                  toast.error(t(serverOffMessage));
                  return;
                }

                if (result) {
                  toast.success(message);
                  await getUsers();
                }
              }}
            />
            {
              <Button
                onClick={async () => {
                  const result = await resetPassword(data.phoneNumber);
                  if (!isServerOn) {
                    toast.error(t(serverOffMessage));
                    return;
                  }

                  if (result) {
                    toast.success(message);
                  }
                }}
                variant="outline"
                title="إعادة ضبط كلمة المرور"
                disabled={data.isSuperUser || isPending}
              >
                <RefreshCcw />
              </Button>
            }
          </div>
        );
      },
    },
  ];

  async function fetchData() {
    await getUsers();
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper
    onRefresh={async()=>{
      await fetchData();
    }}
    paginationOptions={{
        page:2,
        size:10,
        pagesCount:5
    }}
    breadcrumbs={[
      {
        itemTitle: "routes.home",
        link: "/dashboard",
      },
      {
        itemTitle: "routes.user_management",
      },
    ]}
  >
    <div className="p-5">
      <DataTable isLoading={isPending} columns={cols} data={users ?? []} />
    </div>
    </PageWrapper>
  )
};

export default DisplayUserContainer;
