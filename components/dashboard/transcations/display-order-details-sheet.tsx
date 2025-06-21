"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLocalizer from "@/lib/hooks/use-localizer";
import { Calendar, CalendarClock, Currency, DollarSign, Eye, ImageIcon, Info, Mail, MapPin, Notebook, Percent, Phone, SheetIcon, Star, Timer, UserSquare, Wallet } from "lucide-react";
import {
  APITransactionResponseType,
  ClientSubServiceResponseType,
  OrderPhaseTypes,
  OrderStatusTypes,
  PhaseResponseType,
  SendServiceOrderResponseDto,
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
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/table-core";
import SortButton from "@/components/common/sort-button";
import DataTable from "@/components/common/data-table";
import StarRating from "@/components/common/star-rating";
import NoDataBox from "@/components/common/no-data-box";

const OrderDetailsSheet = ({
  visible,
  onClose,
  orderId
}: {
  visible:boolean,
  onClose:()=>void,
  orderId:number,
}) => {
  const { t, isRtl } = useLocalizer();
  const {getOrderDetails} = useTransactionsStore();
  const [orderDetails,setOrderDetails] = React.useState<SendServiceOrderResponseDto | undefined | null>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchData = async ()=>{
    setIsLoading(true);
    const response = await getOrderDetails(orderId);
    if(response?.code == 0 && response?.data){
      setOrderDetails(response?.data);
    }else{
     setOrderDetails(undefined);
    }
    setIsLoading(false);
  }

  React.useLayoutEffect(()=>{
    fetchData();
  },[orderId]);

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



    const cols = React.useMemo<ColumnDef<ClientSubServiceResponseType>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label="#"
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
      },
      {
        accessorKey: "name",
        header: t(`labels.${isRtl ? "ar_desc" : "en_desc"}`),
        cell:({row})=>{
          return isRtl ? row?.original?.arDesc : row?.original?.enDesc
        }
      },
      {
        accessorKey: "subServiceImg",
        header: t("labels.service_image"),
        cell:({row})=>{
          return <Link href={row?.original?.subServiceImg ?? ""} target="_blank">
                <Eye/>
            </Link>
        }
      },
       {
        accessorKey: "offerId",
        header: t("labels.offer_id"),
        cell:({row})=>{
          return row?.original?.offerId ?? "-"
        }
      },
       {
        accessorKey: "discountRate",
        header: t("labels.discount_rate"),
        cell:({row})=>{
          return row?.original?.discountRate  ?? 0 + " % "
        }
      }
    ]
  },[orderId]);


  
    const extraServicesCols = React.useMemo<ColumnDef<string>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label="#"
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
          return row?.index + 1
        }
      },
      {
        accessorKey: "description",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label={t("labels.description")}
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
          return row.original
        }
      },
    ]
  },[orderId]);



  const getPhaseDescription = (phase : OrderPhaseTypes) :string=>{
    switch(phase){
      case OrderPhaseTypes.ReceivedOrder:
      default:
        return isRtl ? "تم استلام الطلب" : "Order received";
      case  OrderPhaseTypes.Preparation:
        return isRtl ? "جاري الاستعداد": "Preparation";
      case OrderPhaseTypes.OnRoad:
        return isRtl ? "على الطريق":"On road";
      case OrderPhaseTypes.OnSite :
        return isRtl ? "في الموقع" : "On site";
      case OrderPhaseTypes.Progress:
        return isRtl ? "قيد التنفيذ" : "Progress";
      case OrderPhaseTypes.Completed:
        return isRtl ? "مكتمل" : "Completed";
      case OrderPhaseTypes.Paid:
        return isRtl ? "تم الدفع" : "Paid";
      case OrderPhaseTypes.ConfirmPayment:
        return isRtl ? "تم تاكيد الدفع" : "payment confirmed"
      
    }
  };

  const getServiceDescription = (status : OrderStatusTypes) : string=>{
    switch(status){
      case OrderStatusTypes.Waiting:
      default:
        return isRtl ? "قيد الانتظار" : "Waiting";
      case  OrderStatusTypes.Pending:
        return isRtl ? "معلق": "Pending";
      case OrderStatusTypes.Approved:
        return isRtl ? "معتمد":"Approved";
      case OrderStatusTypes.Rejected :
        return isRtl ? "مرفوض" : "Rejected";
      case OrderStatusTypes.Canceled:
        return isRtl ? "ملغي" : "Canceled";
      case OrderStatusTypes.CompletedPaid:
        return isRtl ? "اكتمل الدفع": "Completed paid";
    }
  }

    const phasesCols = React.useMemo<ColumnDef<PhaseResponseType>[]>(() => {
    return [
      {
        accessorKey: "phase",
        header: ({ column }) => {
          const isAcs = column.getIsSorted() === "asc";
          return (
            <SortButton
              isAcs={isAcs}
              label="#"
              onSort={() => column.toggleSorting(isAcs)}
            />
          );
        },
        cell:({row})=>{
          return row?.original?.phase
        }
      },
      {
        accessorKey: "description",
        header: t("labels.description"),
        cell:({row})=>{
          return getPhaseDescription(row.original.phase)
        }
      },
      {
        accessorKey: "completed",
        header: t("labels.completed"),
        cell:({row})=>{
          return <ActiveBudge isActive={row.original?.completed ?? false}/>
        }
      },
      {
        accessorKey: "completedAt",
        header: t("labels.completed_at"),
        cell:({row})=>{
          return row?.original?.completedAt ? <bdi >{dateFormat(row?.original?.completedAt ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>
        }
      },
    ]
  },[orderId]);

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetTrigger/>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("titles.show_details")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          {
            isLoading ? <NoDataBox/> :    <>
          <SingleRow
            icon={<Info />}
            label={t("labels.order_id")}
            value={orderDetails?.orderId}
          />

         <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.client_coords")}
          />

         <SingleRow
            icon={<Info />}
            label={t("labels.address")}
            mode="col"
            value={isRtl ? orderDetails?.coords?.arAddress : orderDetails?.coords?.enAddress}
          />

         <SingleRow
            icon={<Info />}
            label={t("labels.default")}
            value={<ActiveBudge isActive={orderDetails?.coords?.isDefault ?? false}/>}
          />

          <SingleRow
            icon={<MapPin />}
            label={t("labels.location")}
            value={<Link href={`https://www.google.com/maps?q=${orderDetails?.coords?.latitudes},${orderDetails?.coords?.longitudes}`} target="_blank">
                <Eye/>
            </Link>}
          />

          <Separator className="my-2"/>


         <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.client_data")}
          />


          <SingleRow
            icon={<Info />}
            label={t("labels.profile_id")}
            value={orderDetails?.client?.profileId ?? ""}
          />

          <SingleRow
            icon={<ImageIcon />}
            label={t("labels.profile_img")}
            value={<Link href={orderDetails?.client?.personImg ?? ""} target="_blank">
                <Eye/>
            </Link>}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.name")}
            value={<TruncatedSpan text={orderDetails?.client?.fullName ?? ""}/> }
          />

          <SingleRow
            icon={<Phone />}
            label={t("labels.phone_number")}
            value={orderDetails?.client?.phoneNumber}
          />

          <SingleRow
            icon={<Mail />}
            label={t("labels.email")}
            value={<TruncatedSpan maxLength={20} text={orderDetails?.client?.email ?? ""}/> }
          />

          <Separator className="my-2"/>


         <TitleHeader
            className="h-12 rounded-none"
            title={t("labels.provider")}
          />

          
          <SingleRow
            icon={<Info />}
            label={t("labels.profile_id")}
            value={orderDetails?.serviceProvider?.profileId ?? ""}
          />

          <SingleRow
            icon={<ImageIcon />}
            label={t("labels.profile_img")}
            value={<Link href={orderDetails?.serviceProvider?.personImg ?? ""} target="_blank">
                <Eye/>
            </Link>}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.name")}
            value={<TruncatedSpan text={orderDetails?.serviceProvider?.fullName ?? ""}/> }
          />

          <SingleRow
            icon={<Phone />}
            label={t("labels.phone_number")}
            value={orderDetails?.serviceProvider?.phoneNumber}
          />

          <SingleRow
            icon={<Mail />}
            label={t("labels.email")}
            value={<TruncatedSpan maxLength={20} text={orderDetails?.serviceProvider?.email ?? ""}/> }
          />
          
          <Separator className="my-2"/>


         <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.service_data")}
          />


         <SingleRow
            icon={<ImageIcon />}
            label={t("labels.service_image")}
            value={<Link href={orderDetails?.orderDetails?.serviceDetails?.serviceImg ?? ""} target="_blank">
                <Eye/>
            </Link>}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.main_service")}
            value={<TruncatedSpan maxLength={30} text={isRtl ? orderDetails?.orderDetails?.serviceDetails?.arDesc ?? "" : orderDetails?.orderDetails?.serviceDetails?.enDesc ?? ""}/>}
          />


          <div className="flex flex-col gap-2">
            <span className="font-bold">{t("titles.sub_services")}</span>
            <DataTable
            columns={cols}
            data={orderDetails?.orderDetails?.serviceDetails?.subServices ?? []}
          />
          </div>


          <Separator className="my-2"/>

          <SingleRow
            icon={<DollarSign />}
            label={t("labels.payment_method")}
            value={orderDetails?.orderDetails?.paymentMethod == 1 ? "Cash" : "Card"}
          />

          {
            orderDetails?.orderDetails?.invoice && <>
              <SingleRow
            icon={<SheetIcon />}
            label={t("labels.invoice_id")}
            value={orderDetails?.orderDetails?.invoice?.invoiceId ?? ""}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.invoice_status")}
            value={orderDetails?.orderDetails?.invoice?.invoiceStatus == 1 ? "Pending" : orderDetails?.orderDetails?.invoice?.invoiceStatus == 2 ? "Paid" : "Canceled"}
          />



          {orderDetails?.orderDetails?.invoice?.paymentMethod == 2 && <SingleRow
            icon={<DollarSign />}
            label={t("labels.payment_channel")}
            value={getPaymentChannelComp(orderDetails?.orderDetails?.invoice.electronicPaymentMethod ?? 0)}
          />
         }
          
          <SingleRow
            icon={<Info />}
            label={t("labels.customer_reference")}
            value={orderDetails?.orderDetails?.invoice?.customerReference ?? ""}
          />
        
         <SingleRow
            icon={<Info />}
            label={t("labels.invoice_reference")}
            value={orderDetails?.orderDetails?.invoice?.invoiceReference ?? ""}
          />
        <SingleRow
            icon={<Info />}
            label={t("labels.transaction_reference")}
            value={orderDetails?.orderDetails?.invoice?.transactionReference ?? ""}
          />
        <SingleRow
            icon={<Currency />}
            label={t("labels.display_currency_iso")}
            value={orderDetails?.orderDetails?.invoice?.displayCurrencyIso ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.customer_service_charge")}
            value={orderDetails?.orderDetails?.invoice?.customerServiceCharge ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.vat_amount")}
            value={orderDetails?.orderDetails?.invoice?.vatAmount ?? ""}
          />
          

       <SingleRow
            icon={<DollarSign />}
            label={t("labels.service_amount")}
            value={orderDetails?.orderDetails?.serviceProviderAmount ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.total_amount")}
            value={orderDetails?.orderDetails?.serviceTotalAmount ?? ""}
          />

        <SingleRow
            icon={<DollarSign />}
            label={t("labels.due_value")}
            value={orderDetails?.orderDetails?.invoice?.dueValue ?? ""}
         />

        <SingleRow
            icon={<Calendar />}
            label={t("labels.expiry_date")}
            value={orderDetails?.orderDetails?.invoice?.expiryDate ? <bdi className={cn( (new Date(orderDetails?.orderDetails?.invoice?.expiryDate ?? "") <= new Date(Date.now())) && " line-through text-danger")}>{dateFormat(orderDetails?.orderDetails?.invoice?.expiryDate ?? "", "dd/mm/yyyy")}</bdi> : <></>}
          />

         <SingleRow
            icon={<Timer />}
            label={t("labels.expiry_time")}
            value={orderDetails?.orderDetails?.invoice?.expiryTime ? <bdi>{orderDetails?.orderDetails?.invoice?.expiryTime?.includes(".") ? orderDetails?.orderDetails?.invoice?.expiryTime?.split(".")[0] : orderDetails?.orderDetails?.invoice?.expiryTime}</bdi> : <></>}
          />

         {orderDetails?.orderDetails?.invoice?.paymentUrl && <SingleRow
            icon={<Info />}
            label={t("labels.payment_url")}
            value={<Link href={orderDetails?.orderDetails?.invoice?.paymentUrl ?? ""} target="_blank">
                <Eye/>
            </Link>}
         />}


         <SingleRow
            icon={<CalendarClock />}
            label={t("labels.transaction_date")}
            value={orderDetails?.orderDetails?.invoice?.transactionDate ? <bdi >{dateFormat(orderDetails?.orderDetails?.invoice?.transactionDate ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

        <SingleRow
            icon={<CalendarClock />}
            label={t("labels.payment_date")}
            value={orderDetails?.orderDetails?.invoice?.paymentDate ? <bdi >{dateFormat(orderDetails?.orderDetails?.invoice?.paymentDate ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

            </>
          }

          <SingleRow
            icon={<CalendarClock />}
            label={t("labels.service_time")}
            value={orderDetails?.serviceTime ? <bdi>{orderDetails?.serviceTime?.includes(".") ? orderDetails?.serviceTime?.split(".")[0] : orderDetails?.serviceTime}</bdi> : <></>}
          />

          <SingleRow
            icon={<Info />}
            label={t("labels.order_status")}
            value={getServiceDescription(orderDetails?.serviceStatus ?? OrderStatusTypes.Waiting)}
          />

         <SingleRow
            icon={<Notebook />}
            label={t("labels.notes")}
            value={<TruncatedSpan maxLength={30} text={orderDetails?.notes ?? ""}/>}
          />

          <SingleRow
            icon={<CalendarClock />}
            label={t("labels.when_change_status_at")}
            value={orderDetails?.whenChangeStatusAt ? <bdi >{dateFormat(orderDetails?.whenChangeStatusAt ?? "", "dd/mm/yyyy hh:MM TT")}</bdi> : <></>}
          />

        <div className="flex flex-col gap-2">
            <span className="font-bold">{t("titles.extra_services")}</span>
       
          <DataTable
            columns={extraServicesCols}
            data={orderDetails?.extraServices ?? []}
          />
          </div>


        <div className="flex flex-col gap-2">
            <span className="font-bold">{t("titles.phases")}</span>
       
          <DataTable
            columns={phasesCols}
            data={orderDetails?.phases ?? []}
          />
          </div>


         <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.service_evaluation")}
          />

          <SingleRow
            icon={<Star />}
            label={t("labels.stars")}
            value={orderDetails?.serviceEvaluation  ? <StarRating initialRating={orderDetails?.serviceEvaluation ?? 0} showValue readonly/> : <></>}
          />

          <SingleRow
            icon={<Info />}
            mode="col"
            label={t("labels.service_evaluation_message")}
            value={orderDetails?.evaluationContent ?? ""}
          />

        </>
          }
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
