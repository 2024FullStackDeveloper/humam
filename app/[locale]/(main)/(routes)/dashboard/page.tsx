"use client";

import DecorationBox from "@/components/common/decoration-box";
import NoDataBox from "@/components/common/no-data-box";
import StatisticBox from "@/components/dashboard/statistic-box";
import { Users2, Users2Icon } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3  items-center gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <StatisticBox
            key={index}
            icon={<Users2Icon />}
            title={"عدد المستخدمين"}
            subtitle={"الشركات"}
            value={0}
          />
        ))}
      </div>
      <DecorationBox
        headerContent={"طلبات المستخدمين القادمة"}
        contentClassName=" h-72 w-full"
      >
        <NoDataBox />
      </DecorationBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
        <DecorationBox
          headerContent={"سجل حركة المستخدمين"}
          contentClassName="h-72 w-full"
        >
          <NoDataBox />
        </DecorationBox>
        <DecorationBox
          headerContent={"طلبات المستخدمين القادمة"}
          contentClassName="h-72 w-full"
        >
          <NoDataBox />
        </DecorationBox>
      </div>
    </div>
  );
};
export default DashboardPage;
