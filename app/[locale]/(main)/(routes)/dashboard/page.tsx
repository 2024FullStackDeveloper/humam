"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import React from "react";


const StatisticsComp = React.lazy(() => import("@/components/dashboard/dashboard-statistics"));
const PendingOrdersComp = React.lazy(() => import("@/components/dashboard/dashboard-pending-order"));
const OnlineProvidersComp = React.lazy(() => import("@/components/dashboard/dashboard-online-provider"));
const TodayTransactionsComp = React.lazy(() => import("@/components/dashboard/dashboard-today-trans"));
const DashboardPage = () => {
  const {t} = useLocalizer();
  return (
    <div className="w-full h-full flex flex-col gap-4">
          
      <StatisticsComp/>
      <PendingOrdersComp/>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
      <OnlineProvidersComp/>
      <TodayTransactionsComp/>
      </div>
    </div>
  );
};
export default DashboardPage;
