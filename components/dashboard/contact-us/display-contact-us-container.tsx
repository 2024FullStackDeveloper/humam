"use client";

import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
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
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import { APIContactUsResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import ContactUsAddDlg from "./contact-us-add-dlg";


const DisplayContactUsContainer = () => {
  const { isPending, result, contacts, getContacts, deleteContact } =
    useContactUsStore();
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const [visible, setVisible] = React.useState<boolean>(false);
  const [createDlgVisible, setCreateDlgVisible] = React.useState<boolean>(false);
  const [deleteContactId, setDeleteContactId] = React.useState<
    number | undefined
  >(undefined);

  const fetchData = async () => {
    await getContacts(paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  const cols = React.useMemo<ColumnDef<APIContactUsResponseType>[]>(() => {
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
        accessorKey: "phoneNumber",
        header: t("labels.phone_number"),
      },

      {
        accessorKey: "crtdAt",
        header: t("labels.crtd_at"),
        cell: ({ row }) => {
          const data = row.original;
          return data.crtdAt ? (
            <bdi>{dateFormat(data.crtdAt, "dd/mm/yyyy hh:MM TT")}</bdi>
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
              <Button
                onClick={() => {
                  setVisible(true);
                  setDeleteContactId(data.id);
                }}
                variant="dangerOutline"
              >
                <Trash2 />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [contacts, paginate]);

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
      onAdd={() => {
         setCreateDlgVisible(true);
      }}
      breadcrumbs={[
        {
          itemTitle: "routes.home",
          link: "/dashboard",
        },
        {
          itemTitle: "routes.global_settings",
          disabled: true,
        },
        {
          itemTitle: "routes.contact_us",
        },
      ]}
    >
      <DataTable isLoading={isPending} columns={cols} data={contacts ?? []} />

      <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteContactId(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("titles.delete_confirmation")}</DialogTitle>
            <Separator className="my-3" />
            <DialogDescription>
              {t("paragraphs.delete_confirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <form
              action={async () => {
                if (deleteContactId) {
                  const result = await deleteContact(deleteContactId);

                  if (!result?.isServerOn) {
                    toast.error(t(result?.serverOffMessage));
                    return;
                  }
                  if (result?.code == 0 && result) {
                    toast.success(result?.message);
                    await fetchData();
                    setVisible(false);
                  } else {
                    toast.error(result?.message);
                  }
                }
              }}
            >
              <FormButton title={t("buttons.ok")} />
            </form>
            <Button
              onClick={() => {
                setVisible(false);
                setDeleteContactId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ContactUsAddDlg 
        title={t("titles.add")} 
        createDlgVisible={createDlgVisible} 
        onCreateDlgVisibleChange={setCreateDlgVisible}  
        onAdded={async () => {
          await fetchData();
        }}    
      />
    </PageWrapper>
  );
};

export default DisplayContactUsContainer;
