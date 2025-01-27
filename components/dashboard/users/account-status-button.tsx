"use client";
import TextButton from "@/components/common/text-button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useLocalizer from "@/lib/hooks/use-localizer";
import { RoleType } from "@/lib/types/api/role-type";
import { AccountStatusType } from "@/lib/types/api/status-type";
import { CheckSquare, LockKeyhole, ScanEye, Underline, X } from "lucide-react";
import React from "react";
export interface AccountStatusButtonProps {
  status: AccountStatusType;
  loading?: boolean;
  disabled?:boolean,
  role?:RoleType,
  onClick: (status: AccountStatusType,statusCode:number) => void;
}
const AccountStatusButton = ({
  role,
  status,
  disabled,
  ...props
}: AccountStatusButtonProps) => {
  const { t } = useLocalizer();
  
  const getStyle = React.useMemo(() => {
    const style =
      status == "Approved"
        ? "successOutline"
        : status == "Rejected" || status == "Stopped"
        ? "dangerOutline"
        : status == "Pending"
        ? "warningOutline"
        : status == "UnderReview"
        ? "infoOutline"
        : "idleOutline";
    return style;
  }, [status]);

  const statusList = React.useCallback((): Array<React.JSX.Element> => {
    if (status == "Approved") {
      return [
        <TextButton
          key={1}
          onClick={() => {
            props?.onClick("Stopped",3);
          }}
          variant="ghost"
          className="flex flex-row items-center gap-2"
        >
          <LockKeyhole size={16} />
          {t("status.Stopped")}
        </TextButton>,
      ];
    }else if(role == "client" && status.toString() == "Approved"){
      return [
        <TextButton
          key={1}
          onClick={() => {
            props?.onClick("Stopped",3);
          }}
          variant="ghost"
          className="flex flex-row items-center gap-2"
        >
          <LockKeyhole size={16} />
          {t("status.Stopped")}
        </TextButton>,
      ];
    }else if(role == "client" && status.toString() == "Stopped"){
      return[
        <TextButton
        key={1}
        onClick={() => {
          props?.onClick("Approved",5);
        }}
        variant="ghost"
        className="flex flex-row items-center gap-2"
      >
        <CheckSquare size={16} />
        {t("status.Approved")}
      </TextButton>,
      ]
    }
    return [
      <TextButton
        key={1}
        onClick={() => {
          props?.onClick("Approved",5);
        }}
        variant="ghost"
        className="flex flex-row items-center gap-2"
      >
        <CheckSquare size={16} />
        {t("status.Approved")}
      </TextButton>,
      <TextButton
        key={2}
        onClick={() => {
          props?.onClick("UnderReview",2);
        }}
        variant="ghost"
        className="flex flex-row items-center gap-2"
      >
        <ScanEye size={16} />
        {t("status.UnderReview")}
      </TextButton>,
      <TextButton
        key={3}
        onClick={() => {
          props?.onClick("Idle",1);
        }}
        variant="ghost"
        className="flex flex-row items-center gap-2"
      >
        <Underline size={16} />
        {t("status.Idle")}
      </TextButton>,
        <TextButton
        key={4}
        onClick={() => {
          props?.onClick("Rejected",4);
        }}
        variant="ghost"
        className="flex flex-row items-center gap-2"
      >
        <X size={16} />
        {t("status.Rejected")}
      </TextButton>,
    ];
  }, [status]);

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant={getStyle}  disabled={props?.loading || disabled}>
          {t(`status.${status}`)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px]">
        <div className="gap-4 flex flex-col">
          {statusList()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccountStatusButton;
