"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import { Calendar, CalendarClock, Currency, DollarSign, Info, Mail, Percent, Phone, SheetIcon, Timer, UserSquare, Wallet } from "lucide-react";
import {
  APITransactionResponseType,
} from "@/lib/types/api/api-type";
import React from "react";
import Image from "next/image";
import SingleRow from "@/components/common/single-row";
import dateFormat from "dateformat";
import ActiveBudge from "@/components/common/active-budge";
import TitleHeader from "@/components/common/title-header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaymentChannel } from "@/lib/utils/stuff-client";
import TruncatedSpan from "@/components/common/truncated-span";
import FormButton from "@/components/common/form-button";
import { useTransactionsStore } from "@/lib/features/transactions/use-transactions-store";

const TransactionDetailsSheet = ({
  data,
}: {
  data: APITransactionResponseType;
}) => {
  const { t, isRtl } = useLocalizer();
  const value = React.useDeferredValue(data);
  const {updateTransaction} = useTransactionsStore();
  const [isTransfered,setIsTransfered] = React.useState<boolean>(data?.profits?.isTransfered ?? false);

  const getPaymentChannelComp = (channel : number) :React.JSX.Element=>{
    const result = getPaymentChannel(channel);
    if(result){
        return (
            <div className="flex flex-row gap-4 items-center">
                <Image
                priority
                alt={result?.PaymentMethodAr}
                width={60}
                height={20}
                src={result?.ImageUrl}
                />
                <span className="font-bold">
                    {isRtl ? result?.PaymentMethodAr : result?.PaymentMethodEn}
                </span>
            </div>
        )
    }
    return <></>;
  }

  const handleUpdate = async (id: number) => {

      const response = await updateTransaction(id);
      if (!response?.isServerOn) {
        toast.error(t(response?.serverOffMessage));
        return;
      }
      if (response?.code == 0 && response?.data) {
        toast.success(response?.message);
        setIsTransfered(true);
      } else {
        toast.error(response?.message);
      }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Info />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("titles.show_details")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          <SingleRow
            icon={<Info />}
            label={"#"}
            value={value?.id}
          />
          <SingleRow
            icon={<Info />}
            label={t("labels.order_id")}
            value={value?.orderId}
          />
          <SingleRow
            icon={<SheetIcon />}
            label={t("labels.invoice_id")}
            value={value?.invoiceId ?? ""}
          />
          <SingleRow
            icon={<Info />}
            label={t("labels.invoice_status")}
            value={value?.invoiceStatus == 1 ? "Pending" : value?.invoiceStatus == 2 ? "Paid" : "Canceled"}
          />

          <SingleRow
            icon={<DollarSign />}
            label={t("labels.payment_method")}
            value={value?.paymentMethod == 1 ? "Cash" : "Card"}
          />

          {value?.paymentMethod == 2 && <SingleRow
            icon={<DollarSign />}
            label={t("labels.payment_channel")}
            value={getPaymentChannelComp(value.electronicPaymentMethod ?? 0)}
          />
         }
          
          <SingleRow
            icon={<Info />}
            label={t("labels.customer_reference")}
            value={value?.customerReference ?? ""}
          />
        
         <SingleRow
            icon={<Info />}
            label={t("labels.invoice_reference")}
            value={value?.invoiceReference ?? ""}
          />
        <SingleRow
            icon={<Info />}
            label={t("labels.transaction_reference")}
            value={value?.transactionReference ?? ""}
          />
        <SingleRow
            icon={<Currency />}
            label={t("labels.display_currency_iso")}
            value={value?.displayCurrencyIso ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.customer_service_charge")}
            value={value?.customerServiceCharge ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.vat_amount")}
            value={value?.vatAmount ?? ""}
          />
          

       <SingleRow
            icon={<DollarSign />}
            label={t("labels.service_amount")}
            value={value?.serviceAmount ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.total_amount")}
            value={value?.totalAmount ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.due_value")}
            value={value?.dueValue ?? ""}
         />

        <SingleRow
            icon={<Calendar />}
            label={t("labels.expiry_date")}
            value={value?.expiryDate ? <bdi className={cn( (new Date(data?.expiryDate ?? "") <= new Date(Date.now())) && " line-through text-danger")}>{dateFormat(data?.expiryDate ?? "", "dd/mm/yyyy")}</bdi> : <></>}
          />

         <SingleRow
            icon={<Timer />}
            label={t("labels.expiry_time")}
            value={value?.expiryTime ? <bdi>{value?.expiryTime?.includes(".") ? value?.expiryTime?.split(".")[0] : value?.expiryTime}</bdi> : <></>}
          />

         <SingleRow
            icon={<Info />}
            label={t("labels.status")}
            value={value?.status == 1 ? "Pending" : "Completed"}
         />


         <SingleRow
            icon={<CalendarClock />}
            label={t("labels.transaction_date")}
            value={value?.transactionDate ? <bdi >{dateFormat(data?.transactionDate ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

        <SingleRow
            icon={<CalendarClock />}
            label={t("labels.payment_date")}
            value={value?.paymentDate ? <bdi >{dateFormat(data?.paymentDate ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

         <SingleRow
            icon={<CalendarClock />}
            label={t("labels.crtd_at")}
            value={value?.crtdAt ? <bdi >{dateFormat(data?.crtdAt ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />


         <SingleRow
            icon={<CalendarClock />}
            label={t("labels.last_update_at")}
            value={value?.lastUpdateAt ? <bdi >{dateFormat(data?.lastUpdateAt ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

          <TitleHeader
            className="h-12 rounded-none"
            title={t("labels.provider")}
          />

         <SingleRow
            icon={<UserSquare />}
            label={t("labels.name")}
            value={<TruncatedSpan maxLength={30} text={value?.profits?.providerInfo?.name ?? ""}/>}
         />

        <SingleRow
            icon={<Info />}
            label={t("labels.is_company")}
            value={<ActiveBudge isActive={value?.profits?.providerInfo?.isCompany ?? false}/>}
         />

        <SingleRow
            icon={<Phone />}
            label={t("labels.phone_number")}
            value={value?.profits?.providerInfo?.phoneNumber}
         />

        <SingleRow
            icon={<Mail />}
            label={t("labels.email")}
            value={<TruncatedSpan maxLength={20} text={value?.profits?.providerInfo?.email ?? ""}/>}
         />

          <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.commission_details")}
          />

         <SingleRow
            icon={<Percent />}
            label={t("labels.provider_percentage")}
            value={value?.profits?.providerPercentage + " % "}
         />

        <SingleRow
            icon={<Wallet />}
            label={t("labels.provider_profit")}
            value={value?.profits?.providerProfit ?? ""}
         />

        <SingleRow
            icon={<Wallet />}
            label={t("labels.platform_profit")}
            value={value?.profits?.platformProfit ?? ""}
         />
                 
        <SingleRow
            icon={<Info />}
            label={t("labels.review_approve")}
            value={<ActiveBudge isActive={isTransfered ?? false}/>}
         />

         {
          !isTransfered && <form action={ async ()=>{
            await handleUpdate(value.id)
          }}>
            <FormButton className="w-full" title={t("labels.review_approve")}/>
          </form>
         }
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionDetailsSheet;
