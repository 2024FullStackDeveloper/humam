"use client";
import { cn } from "@/lib/utils";
import useLocalizer from "@/lib/hooks/use-localizer";
import React from "react";
import { Loader2 } from "lucide-react";
import { DropdownType } from "@/lib/types/common-type";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
export interface SelectListProps {
  disabled?: boolean;
  id?: string;
  label: string;
  value?: string;
  error?: string;
  placeholder?: string;
  prefixicon: React.ReactNode;
  loading?: boolean;
  options?: Array<DropdownType<number | string>>;
  onValueChange?: (value: string) => void;
}

const SelectList = ({
  label,
  error,
  loading = false,
  options,
  ...props
}: SelectListProps) => {
  const { locale, t } = useLocalizer();
  const optionsLen = React.useMemo((): number => {
    return options?.length ?? 0;
  }, [options]);

  return (
    <div  className="gap-2 flex flex-col">
      <Label htmlFor={props?.id} className="mb-1 text-sm md:text-lg">
        {label}
      </Label>
      <div
        className={cn(
          "border rounded-lg items-center justify-center flex flex-row px-2",
          error && "border-failure/90"
        )}
      >
        <span className="text-extraLight">{props?.prefixicon}</span>

        <Select
          value={props?.value}
          disabled={optionsLen == 0 || props?.disabled}
          onValueChange={(value) => {
            if (props?.onValueChange) {
              props?.onValueChange(value);
            }
          }}
        >
          <SelectTrigger className="select-none border-none outline-none focus-visible:outline-none  focus-visible:ring-transparent">
            <SelectValue
              placeholder={
                loading ? (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <Loader2 className="animate-spin" />
                    {t("paragraphs.loading")}
                  </div>
                ) : (
                  props?.placeholder
                )
              }
            />
          </SelectTrigger>
          {optionsLen > 0 && (
            <SelectContent>
              {options?.map((e) => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {locale == "ar" ? e?.arDesc : e?.arDesc || e?.enDesc}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      </div>
      <strong>{error}</strong>
    </div>
  );
};
export default SelectList;
