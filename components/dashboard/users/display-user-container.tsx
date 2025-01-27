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
import { useRouter } from "@/i18n/routing";
import usePaginate from "@/lib/hooks/use-paginate";

const DisplayUserContainer = () => {
  const { t } = useLocalizer();
  const {paginate} = usePaginate();
  const paginateValue = React.useDeferredValue(paginate);
  const router = useRouter();

  const {
    getUsers,
    result,
    users,
    isPending,
    message,
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
    await getUsers(paginateValue);
  }

  React.useEffect(() => {
    fetchData();
  }, [paginateValue]);

  return (
    <PageWrapper
    onRefresh={async()=>{
      await fetchData();
    }}
    onAdd={()=>{
      router.push("/dashboard/users/create");
    }}
    paginationOptions={{
        pagesCount:result?.result?.data?.numberOfPages,
        itemCount:result?.result?.data?.count,
        size:paginateValue?.size ?? 50,
        page:paginateValue?.page ?? 1
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
      <DataTable isLoading={isPending} columns={cols} data={users ?? []} />
    </PageWrapper>
  )
};

export default DisplayUserContainer;
