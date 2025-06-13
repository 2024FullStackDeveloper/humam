"use client";

import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import PageWrapper from "@/components/common/page-wrapper";
import SortButton from "@/components/common/sort-button";
import TruncatedSpan from "@/components/common/truncated-span";
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
import { useCommonQuestionsStore } from "@/lib/features/common-questions/use-common-questions-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";import {
    APICommonQuestionsResponseType,
} from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import CommonQuestionDetailsSheet from "./common-question-details-sheet";
import CommonQuestionAddDlg from "./common-question-add-dlg";
import CommonQuestionUpdateSheet from "./common-question-update-sheet";

const DisplayCommonQuestionsContainer = () => {
  
  const { t } = useLocalizer();
  const { paginate } = usePaginate();
  const [createDlgVisible, setCreateDlgVisible] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [deleteCommonQuestionId, setDeleteCommonQuestionId] = React.useState<number | undefined>(undefined);
  const {
    isPending,
    commonQuestions,
    result,
    getCommonQuestions,
    deleteCommonQuestion
  } = useCommonQuestionsStore();

  const fetchData = async () => {
    await getCommonQuestions(paginate);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);




  const cols = React.useMemo<ColumnDef<APICommonQuestionsResponseType>[]>(() => {
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
        accessorKey: "arQuestion",
        header: t("labels.ar_question"),
        cell: ({ row }) => {
          const data = row.original;
          return <TruncatedSpan text={data.arAnswer} />
        },
      },
     {
        accessorKey: "arAnswer",
        header: t("labels.ar_answer"),
        cell: ({ row }) => {
          const data = row.original;
          return <TruncatedSpan text={data.arAnswer} />
        },
      },
     {
        accessorKey: "enQuestion",
        header: t("labels.en_question"),
        cell: ({ row }) => {
          const data = row.original;
          return <TruncatedSpan text={data.enQuestion} />
        },
      },
     {
        accessorKey: "enAnswer",
        header: t("labels.en_answer"),
        cell: ({ row }) => {
          const data = row.original;
          return <TruncatedSpan text={data.enAnswer} />
        },
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
        accessorKey: "lastUpdateAt",
        header: t("labels.last_update_at"),
        cell: ({ row }) => {
          const data = row.original;
          return data.lastUpdateAt ? (
            <bdi>{dateFormat(data.lastUpdateAt, "dd/mm/yyyy hh:MM TT")}</bdi> 
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
              <CommonQuestionDetailsSheet data={data}/>
              <CommonQuestionUpdateSheet 
              onUpdated={async () => {
                await fetchData();
              }}
              title={t("titles.update")} 
              data={data}/>
              <Button
                onClick={() => {
                  setDeleteCommonQuestionId(data.id);
                  setVisible(true);
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
  }, [commonQuestions, paginate]);

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
          itemTitle: "routes.common_questions",
        },
      ]}
    >
      <DataTable
        isLoading={isPending}
        columns={cols}
        data={commonQuestions ?? []}
      />
    <CommonQuestionAddDlg 
    title={t("titles.add_common_question")}
    createDlgVisible={createDlgVisible}
    onCreateDlgVisibleChange={setCreateDlgVisible}
    onAdded={async () => {
      await fetchData();
    }}
    />
     <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteCommonQuestionId(undefined);
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
                if (deleteCommonQuestionId) {
                  const result = await deleteCommonQuestion(deleteCommonQuestionId);

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
                setDeleteCommonQuestionId(undefined);
              }}
              variant="secondary"
            >
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default DisplayCommonQuestionsContainer;
