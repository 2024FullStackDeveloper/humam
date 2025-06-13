"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import CircleButton from "./circle-button";
import { cn } from "@/lib/utils";
import useLocalizer from "@/lib/hooks/use-localizer";
import { usePathname, useRouter } from "@/i18n/routing";
import DataTablePagination, {
  DataTablepaginationProps,
} from "./data-table-pagination";
import { Button } from "../ui/button";
import { Filter, Plus, RefreshCcw, X } from "lucide-react";
// import { useToggle } from "@uidotdev/usehooks";
// import { Switch } from "../ui/switch";
import { VariantButtomType } from "@/lib/types/common-type";
import LoadingButton from "./loading-button";
import { useSearchParams } from "next/navigation";
import SizeLimmitList from "./size-limit-list";
import usePaginate from "@/lib/hooks/use-paginate";
import { useToggle } from "@uidotdev/usehooks";

export interface StickyButtonProps {
  className?: string;
  label: string;
  variant?: VariantButtomType;
  onClick?: () => void;
}

const PageWrapper = ({
  children,
  breadcrumbs,
  contentClassName,
  ...props
}: React.PropsWithChildren<{
  breadcrumbs: Array<{
    itemTitle: string;
    link?: string;
  }>;
  contentClassName?: string;
  stickyButtomControls?: boolean;
  paginationOptions?: DataTablepaginationProps;
  onRefresh?: () => void;
  onAdd?: () => void;
  filterable?: boolean,
  onFilterOpened?:()=>void,
  onFilterClosed?:()=>void,
  filterComponents?: React.ReactNode;
  stickyLeftButtonOptions?: StickyButtonProps;
  stickyRightButtonOptions?: StickyButtonProps & {
    disabled?: boolean;
    loading?: boolean;
  };
  enableBackButton?: boolean;
}>) => {
  const { t } = useLocalizer();
  const router = useRouter();
  // const [on, toggle] = useToggle(false);
  const params = useSearchParams();
  // const searchParams = new URLSearchParams(params.toString());
  const path = usePathname();
  const paginationValue = React.useDeferredValue(props?.paginationOptions);
  const { isPaginateEnabled } = usePaginate();
  const [on, toggle] = useToggle(false);

  const breadcrumbsRender = React.useMemo(():
    | Array<React.JSX.Element>
    | undefined => {
    const result: Array<React.JSX.Element> = [];
    if (breadcrumbs?.length > 0) {
      for (let index = 0; index < breadcrumbs.length; index++) {
        const length = breadcrumbs.length - 1;
        const item = breadcrumbs[index];
        result.push(
          <BreadcrumbItem key={index}>
            {index < length ? (
              <BreadcrumbLink href={item.link ?? ""}>
                {t(item.itemTitle)}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-bold">
                {t(item.itemTitle)}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        );

        if (index < length) {
          result.push(<BreadcrumbSeparator key={`separator-${index}`} />);
        }
      }
      return result;
    }
    return undefined;
  }, [breadcrumbs]);

  React.useEffect(() => {
    if (
      isPaginateEnabled &&
      !path.includes("create") &&
      !path.includes("update") &&
      !path.includes("settings") &&
      !path.includes("about-app") &&
      !path.includes("profile")
    ) {
      router.push(
        path +
          "?" +
          `paginate=true&page=${paginationValue?.page ?? 0}&size=${
            paginationValue?.size ?? 0
          }`
      );
    }
  }, [isPaginateEnabled]);

  return (
    <div className=" w-full h-full relative  rounded-md !bg-secondary/10 shadow flex flex-col">
      <header className="h-20 w-full border-b-2 border-primary text-primary flex flex-row items-center justify-between p-5">
        <Breadcrumb>
          <BreadcrumbList className="text-lg">
            {breadcrumbsRender}
          </BreadcrumbList>
        </Breadcrumb>
        {props?.enableBackButton && (
          <CircleButton
            type="back"
            className="h-10 w-10"
            variant="default"
            onClick={() => {
              router.back();
            }}
          />
        )}
      </header>
      <div className={cn("grow", contentClassName)}>
        {!props?.stickyButtomControls && (
          <div className="flex flex-col gap-4 p-5 bg-white rounded-lg mx-5 mt-2 shadow">
            <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-3">
              <div className="flex flex-row items-center gap-2">
                {props?.onRefresh && (
                  <Button variant="default" onClick={props?.onRefresh}>
                    <RefreshCcw />
                  </Button>
                )}
                {props?.onAdd && (
                  <Button variant="successOutline" onClick={props?.onAdd}>
                    <Plus />
                  </Button>
                )}
                {props?.filterable && (
                  <Button
                    onClick={() => {
                      if (props?.filterable) {
                        const value = !on;
                        toggle(value);
                        if(props?.onFilterOpened){
                          props?.onFilterOpened();
                          return;
                        } 
                        if(props?.onFilterClosed){
                          props?.onFilterClosed();
                        }
                      }
                    }}
                    variant="destructive"
                  >
                    {!on ? <Filter /> : <X />}
                  </Button>
                )}
              </div>

              <div className="flex flex-row items-center gap-2">
                {/* <Switch
              label={t("labels.disable_paginate_option")}
              id="paginate"
              dir="ltr"
              checked={on}
              onCheckedChange={(checked)=>{
                if(checked){
                  router.push(path.replace(searchParams.toString(),""));
                }else{
                  router.push(path + "?" + `paginate=true&page=${paginationValue?.page ?? 0}&size=${paginationValue?.size ?? 0}`);
                }
                toggle(checked);
              }}
            /> */}
                <SizeLimmitList
                  limits={[10, 20, 30, 50, 100, 200, 500, 1000]}
                  placeholder="عدد عناصر العرض"
                />
              </div>
            </div>
            {on && props?.filterComponents && (
              <div className="flex flex-col gap-2 w-full">
                {props?.filterComponents}
              </div>
            )}
          </div>
        )}
        <div className="w-full h-full p-5">{children}</div>
      </div>
      {!props?.stickyButtomControls &&
        isPaginateEnabled &&
        props?.paginationOptions && (
          <DataTablePagination {...props?.paginationOptions} />
        )}
      {props?.stickyButtomControls && (
        <div className=" sticky flex flex-row bg-primary w-full rounded-bl-lg rounded-br-lg z-50 justify-between h-20 bottom-0 items-center px-6 border-t border-t-right bg-white ">
          <div className="w-full flex flex-row justify-between items-center">
            {props?.stickyLeftButtonOptions && (
              <Button
                {...props?.stickyLeftButtonOptions}
                variant={props?.stickyLeftButtonOptions?.variant ?? "ghost"}
              >
                {props?.stickyLeftButtonOptions?.label}
              </Button>
            )}
            {props?.stickyRightButtonOptions && (
              <LoadingButton
                {...props?.stickyRightButtonOptions}
                label={props?.stickyRightButtonOptions?.label}
                variant={props?.stickyRightButtonOptions?.variant ?? "default"}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageWrapper;
