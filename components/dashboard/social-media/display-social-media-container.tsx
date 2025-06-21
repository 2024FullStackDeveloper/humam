"use client";

import DataTable from "@/components/common/data-table";
import FormButton from "@/components/common/form-button";
import LoadingButton from "@/components/common/loading-button";
import PageWrapper from "@/components/common/page-wrapper";
import SelectList from "@/components/common/select-list";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSocialMediaStore } from "@/lib/features/social-meida/use-social-media-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import usePaginate from "@/lib/hooks/use-paginate";
import { IEditSocialMediaSchema, ISocialMediaSchema } from "@/lib/schemas/social-media-schema";
import {
  APISocialMediaResponseType,
  SocialMediaType,
} from "@/lib/types/api/api-type";
import {
  getSocialMediaNameFromType,
  validateData,
} from "@/lib/utils/stuff-client";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { Edit, Link, SaveIcon, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const DisplaySocialMediaContainer = () => {
  const urlRef = React.useRef<HTMLInputElement>(null);
  const { t, isRtl } = useLocalizer();
  const { paginate } = usePaginate();
  const [createDlgVisible, setCreateDlgVisible] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [deleteSocialMediaId, setDeleteSocialMediaId] = React.useState<
    number | undefined
  >(undefined);
  const [addRequest, setAddRequest] = React.useState<
    z.infer<typeof ISocialMediaSchema>
  >({ socialMediaTypeId: SocialMediaType.facebook, url: "" });
  const [addErrors, setAddErrors] = React.useState<any | undefined>(undefined);
  const [editErrors, setEditErrors] = React.useState<any | undefined>(undefined);
 
  const [socialMediaState, setSocialMediaState] = React.useState<
    | {
        rowIndex: number;
        mode: "edit" | "view";
        data: string | null;
      }
    | undefined
  >(undefined);
  const {
    isPending,
    getSocialMedias,
    socialMedias,
    result,
    addSocialMedia,
    deleteSocialMedia,
    patchSocialMedia
  } = useSocialMediaStore();
  const fetchData = async () => {
    await getSocialMedias(paginate);
    setSocialMediaState(undefined);
    setAddErrors(undefined);
    setEditErrors(undefined);
  };

  React.useEffect(() => {
    fetchData();
  }, [paginate]);

  React.useEffect(() => {
    if (socialMediaState?.mode === "edit" && urlRef.current) {
      urlRef.current.focus();
    }
  }, [socialMediaState]);

  const handleAddSocialMedia = async () => {
    setAddErrors(undefined);
    const validate = validateData(ISocialMediaSchema, addRequest);

    if (!validate.isValid) {
      setAddErrors(validate.errorsList);
      return;
    }
    const response = await addSocialMedia(addRequest);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      setCreateDlgVisible(false);
      setAddRequest({
        socialMediaTypeId: SocialMediaType.facebook,
        url: "",
      });
      await fetchData();
    } else {
      toast.error(response?.message);
    }
  };


  const handlePatchSocialMedia = async (id: number) => {
    setEditErrors(undefined);
    const validate = validateData(IEditSocialMediaSchema, {
      url: socialMediaState?.data ?? "",
    });

    if (!validate.isValid) {
      setEditErrors(validate.errorsList);
      return;
    }
    const response = await patchSocialMedia(id, {
      url: socialMediaState?.data ?? "",
    });
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      setSocialMediaState(undefined);
      await fetchData();
    } else {
      toast.error(response?.message);
    }
  };


  const cols = React.useMemo<ColumnDef<APISocialMediaResponseType>[]>(() => {
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
        accessorKey: "socialMediaTypeId",
        header: t("labels.social_media_type"),
        cell: ({ row }) => {
          return getSocialMediaNameFromType(
            isRtl,
            row.original.socialMediaTypeId
          );
        },
      },
      {
        accessorKey: "url",
        header: t("labels.url"),
        cell: ({ row }) => {
          const data = row.original;
          return row?.index == socialMediaState?.rowIndex &&
            socialMediaState?.mode == "edit" ? (
            <Input
              label={""}
              ref={urlRef}
              prefixicon={undefined}
              defaultValue={
                socialMediaState?.rowIndex == row.index &&
                socialMediaState?.mode == "edit"
                  ? socialMediaState.data ?? ""
                  : data?.url ?? ""
              }
              onChange={({ currentTarget: { value } }) => {
                setSocialMediaState({
                  ...socialMediaState,
                  rowIndex: row.index,
                  data: value,
                  mode: "edit",
                });
              }}
              error={editErrors?.url && t(editErrors?.url?.[0])}
            />
          ) : (
            <span className="text-sm ">{data?.url}</span>
          );
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
              <Button
                onClick={async () => {
                  setEditErrors(undefined);
                  if(socialMediaState?.rowIndex == row.index && socialMediaState?.mode == "edit") {
                    const editSocialMediaErrorResult = IEditSocialMediaSchema.safeParse({url:socialMediaState?.data});
                    if(!editSocialMediaErrorResult.success){
                      setEditErrors(editSocialMediaErrorResult.error.flatten().fieldErrors);
                      return;
                    }
                    await handlePatchSocialMedia(data?.id);
                    return;
                  }
                  setSocialMediaState({
                    rowIndex: row.index,
                    mode: "edit",
                    data: data?.url,
                  });
                }}
                variant={
                  socialMediaState?.rowIndex == row.index &&
                  socialMediaState?.mode == "edit"
                    ? "successOutline"
                    : "destructive"
                }
              >
                {socialMediaState?.rowIndex != row.index ? (
                  <Edit />
                ) : (
                  <SaveIcon />
                )}
              </Button>
              <Button
                onClick={() => {
                  setDeleteSocialMediaId(data?.id);
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
  }, [socialMedias, socialMediaState, paginate,editErrors]);

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
          itemTitle: "routes.social_media",
        },
      ]}
    >
      <DataTable
        isLoading={isPending}
        columns={cols}
        data={socialMedias ?? []}
      />

      <Dialog open={createDlgVisible} onOpenChange={setCreateDlgVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("titles.add_social_media")}</DialogTitle>
            <Separator className="my-3" />
            <DialogDescription />
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col gap-4 w-full">
              <SelectList
                options={[
                  {
                    id: SocialMediaType.facebook,
                    arDesc: t("socialMedias.facebook"),
                  },
                  {
                    id: SocialMediaType.gmail,
                    arDesc: t("socialMedias.gmail"),
                  },
                  {
                    id: SocialMediaType.instagram,
                    arDesc: t("socialMedias.instagram"),
                  },
                  {
                    id: SocialMediaType.linkedIn,
                    arDesc: t("socialMedias.linkedin"),
                  },
                  { id: SocialMediaType.x, arDesc: t("socialMedias.x") },
                  {
                    id: SocialMediaType.youTube,
                    arDesc: t("socialMedias.youtube"),
                  },
                ]}
                label={t("labels.social_media_type")}
                prefixicon={undefined}
                onValueChange={(value) => {
                  setAddRequest({
                    socialMediaTypeId: parseInt(value),
                    url: addRequest?.url ?? "",
                  });
                }}
                value={addRequest?.socialMediaTypeId?.toString() ?? ""}
                error={
                  addErrors?.socialMediaTypeId &&
                  t(addErrors?.socialMediaTypeId?.[0])
                }
              />

              <Input
                label={t("labels.url")}
                prefixicon={<Link />}
                onChange={({ currentTarget: { value } }) => {
                  setAddRequest({
                    socialMediaTypeId:
                      addRequest?.socialMediaTypeId ?? SocialMediaType.facebook,
                    url: value,
                  });
                }}
                error={addErrors?.url && t(addErrors?.url?.[0])}
              />
              <div className="flex flex-row gap-2">
                <LoadingButton
                  onClick={handleAddSocialMedia}
                  loading={isPending}
                  label={t("buttons.save")}
                />
                <Button
                  onClick={(event) => {
                    setCreateDlgVisible(false);
                    setAddRequest({
                      socialMediaTypeId: SocialMediaType.facebook,
                      url: "",
                    });
                  }}
                  variant="secondary"
                >
                  {t("buttons.cancel")}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={visible}
        onOpenChange={() => {
          setVisible(false);
          setDeleteSocialMediaId(undefined);
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
                if (deleteSocialMediaId) {
                  const result = await deleteSocialMedia(deleteSocialMediaId);

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
                setDeleteSocialMediaId(undefined);
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

export default DisplaySocialMediaContainer;
