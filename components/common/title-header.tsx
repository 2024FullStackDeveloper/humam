"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import CircleButton, { CircleButtonProps } from "./circle-button";
import { RefAttributes } from "react";
import { cn } from "@/lib/utils";
const TitleHeader = ({
  title,
  showTailing = false,
  className,
  ...props
}: {title: string; showTailing?: boolean } & CircleButtonProps &
  RefAttributes<HTMLDivElement>) => {
  const { isRtl } = useLocalizer();
  return (
    <>
      <style jsx>
        {`
          .square-box::after {
            content: " ";
            position: absolute;
            height: 80px;
            width: 80px;
            z-index: 1;
            background-color: hsl(var(--destructive));
            transform: rotate(45deg);
            right: ${isRtl ? "-50px" : "unset"};
            left: ${!isRtl ? "-50px" : "unset"};
          }
        `}
      </style>
      <header className={cn("h-20 w-full square-box relative bg-primary overflow-hidden rounded-tl-lg rounded-tr-lg flex flex-row items-center justify-between",className)}>
        <h2 className="text-white indent-14 text-md sm:text-xl">{title}</h2>
        {showTailing == true && (
          <CircleButton className="!w-8 !h-8 mx-4" {...props} />
        )}
      </header>
    </>
  );
};

export default TitleHeader;
