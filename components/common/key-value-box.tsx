"use client";

import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
interface KeyValueBoxProps {
  keyTitle: string;
  keyClassName?: string;
  value: string | React.ReactNode;
}
const KeyValueBox: React.FC<KeyValueBoxProps> = ({
  keyTitle,
  keyClassName,
  value,
}) => {
  return (
    <div className="flex flex-row border justify-between rounded-sm p-2">
      <div className="flex flex-row items-center">
        <span className={cn("font-semibold text-sm", keyClassName)}>
          {keyTitle}
        </span>
        <Separator className="mx-2" orientation="vertical" />
      </div>
      {typeof value === "string" ? (
        <span className="ml-2">{value}</span>
      ) : (
        <div className="flex mx-2">{value}</div>
      )}
    </div>
  );
};
export default KeyValueBox;
