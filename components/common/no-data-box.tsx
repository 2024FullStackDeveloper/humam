"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import Image from "next/image";

const NoDataBox = () => {
  const { t } = useLocalizer();
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Image src="/assets/empty.png" height={80} width={80} alt="empty" />
      <span className="text-primary text-[16px] select-none font-bold">
        {t("paragraphs.empty_data")}
      </span>
    </div>
  );
};

export default NoDataBox;
