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
import { FormInput, Phone, RefreshCcw } from "lucide-react";
import React from "react";
import DataTable from "@/components/common/data-table";
import PageWrapper from "@/components/common/page-wrapper";
import { useRouter } from "@/i18n/routing";
import usePaginate from "@/lib/hooks/use-paginate";
import SortButton from "@/components/common/sort-button";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import { Input } from "@/components/ui/input";
import PhoneNumberInput from "@/components/common/phone-number-input";
import FormButton from "@/components/common/form-button";

const DisplayUserContainer = () => {
  const { t } = useLocalizer();
  const {paginate} = usePaginate();
  const paginateValue = React.useDeferredValue(paginate);
  const router = useRouter();
  const [filter,setFilter] = React.useState<string | undefined>(undefined);

  const {
    getUsers,
    filterUsersByPhoneNumber,
    result,
    users,
    isPending,
    message,
    isServerOn,
    serverOffMessage,
    resetPassword,
    changeStatus,
  } = useUsersStore();

  const 
  {mainServices,
  getMainServices
  } = useServicesStore();


  const cols: ColumnDef<APIUserResponseType>[] = [
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
      cell: ({ row }) => {
        return row.index + 1;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => {
        const isAcs = column.getIsSorted() === "asc";
        return (
          <SortButton
            isAcs={isAcs}
            label={t("labels.phone_number")}
            onSort={() => column.toggleSorting(isAcs)}
          />
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        const isAcs = column.getIsSorted() === "asc";
        return (
          <SortButton
            isAcs={isAcs}
            label={t("labels.email")}
            onSort={() => column.toggleSorting(isAcs)}
          />
        );
      },
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
      cell:  ({ row }) => {
        const data = row.original;
        return (
          <div className="flex flex-row items-center justify-center gap-2">
            <UserDetailsSheet
              isPending={isPending}
              mainServices={mainServices}
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


  async function callOnce() {
    await getMainServices({paginate:false,size:0,page:0}); 
  }

  async function fetchData() {
    await getUsers(paginateValue);
  }

  React.useEffect(() => {
    callOnce();
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [paginateValue]);


  return (
    <PageWrapper
    filterable
    onFilterClosed={()=>setFilter(undefined)}
    filterComponents = {
        <form action={async()=>{
          if(filter){
            await filterUsersByPhoneNumber(filter.replace("+",""));
          }
        }} className="flex flex-row flex-wrap items-center gap-2">
          <PhoneNumberInput label={""}               
           onValueChange={(value) => {
                setFilter(value);
              }} placeholder={t("placeholders.phone_number")}/>
          <FormButton variant="destructive" title={t("buttons.search")}/>        
          </form>
    }

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
