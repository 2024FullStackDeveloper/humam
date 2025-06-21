"use client";

import { Users2Icon } from "lucide-react";
import StatisticBox from "./statistic-box";
import WalletBox from "./transcations/wallet-box";
import useLocalizer from "@/lib/hooks/use-localizer";
import { useDashboardStore } from "@/lib/features/dashboard/use-dashboard-store";
import React from "react";

const DashboardStatistics = () => {
  const { t } = useLocalizer();
  const {statistics,isPending , getDashboard} = useDashboardStore();


  const fetchData = async () => {
    await getDashboard();
  }

  React.useEffect(()=>{
    fetchData();
  },[]);


  return (
    <>
    
      <div className="grid grid-cols-1 lg:grid-cols-3  items-center gap-2">
        <StatisticBox
          icon={<Users2Icon />}
          title={t("titles.clients_count")}
          subtitle={""}
          value={statistics?.clientsCount ?? 0}
          />

        <StatisticBox
          icon={<Users2Icon />}
          title={t("titles.org_providers_count")}
          subtitle={""}
          value={statistics?.organizationProvidersCount ?? 0}
          />


        <StatisticBox
          icon={<Users2Icon />}
          title={t("titles.workers_count")}
          subtitle={""}
          value={statistics?.workerProvidersCount ?? 0}
          />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 mt-2">
        <WalletBox
          loading={isPending}
          title={t("titles.wallet_balance")}
          color="blue"
          balance={statistics?.wallet?.balance ?? 0}
        />

        <WalletBox
          loading={isPending}
          title={t("titles.pending_balance")}
          color="orange"
          balance={ statistics?.wallet?.pendingProfit ?? 0}
        />

        <WalletBox
          loading={isPending}
          title={t("titles.receiving_balance")}
          color="green"
          balance={ statistics?.wallet?.receivingProfit ?? 0}
        />
      </div>
    </>
  );
}   


export default DashboardStatistics;