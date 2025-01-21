"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
export interface DataTablepaginationProps {
  maxPages?: number;
  itemCount?: number;
  pagesCount?: number;
  size?: number;
  page?: number;
}
const DataTablePagination = ({
  maxPages = 5,
  pagesCount,
  size,
  page,
}: DataTablepaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const getPureSearchParams = React.useMemo((): string => {
    if (params) {
      if (params.has("size")) {
        params.delete("size");
      }
      if (params.has("page")) {
        params.delete("page");
      }
      try {
        if (params  && params?.toString()?.length > 0) {
          return "&" + params.toString();
        }
      } catch {return ""}
    }
    return "";
  }, [searchParams, pathname, params]);

  const showPrevious = React.useMemo((): boolean => {
    let result = false;
    if ((page ?? 0) > 1 && (pagesCount ?? 0) > 0) {
      result = true;
    }
    return result;
  }, [page, pagesCount]);

  const showNext = React.useMemo((): boolean => {
    let result = false;
    if ((page ?? 0) < (pagesCount ?? 0) && (pagesCount ?? 0) > 0) {
      result = true;
    }
    return result;
  }, [page, pagesCount]);

  const pages = React.useMemo((): Array<number> | undefined => {
    if (!pagesCount || !page) return undefined;

    const pages = [];
    let startPage = Math.max(1, page - Math.floor(maxPages / 2));
    const endPage = Math.min(pagesCount, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagesCount, page, maxPages]);

  return (
    <div
      className="sticky flex flex-row bg-primary w-full z-50  justify-between h-20 bottom-0 items-center px-6 border-t border-t-right bg-white"
    >
      <Pagination>
        <PaginationContent className="w-full flex justify-between items-center">
          <PaginationItem>
            {showPrevious && (
              <PaginationPrevious
                href={`${pathname}?size=${size}&page=${
                  (page ?? 0) - 1
                }${getPureSearchParams}`}
                className="min-w-[100px] bg-primary text-white shadow  gap-2  border border-primary font-semibold"
              />
            )}
          </PaginationItem>
          <div  className="gap-1 flex flex-row items-center justify-center">
            {pages &&
              pages?.map((e) => (
                <PaginationItem key={e}>
                  <PaginationLink
                    isActive={e == page}
                    href={`${pathname}?size=${size}&page=${e}${getPureSearchParams}`}
                  >
                    {e}
                  </PaginationLink>
                </PaginationItem>
              ))}
          </div>
          <PaginationItem>
            {showNext && (
              <PaginationNext
                href={`${pathname}?size=${size}&page=${
                  (page ?? 0) + 1
                }${getPureSearchParams}`}
                className="min-w-[100px] bg-primary text-white shadow  gap-2  border border-primary font-semibold"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DataTablePagination;
