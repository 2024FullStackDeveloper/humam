"use client";
import DataTable from "@/components/common/data-table";
import DisplayInput from "@/components/common/display-input";
import TitleHeader from "@/components/common/title-header";
import TruncatedSpan from "@/components/common/truncated-span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useOffersStore } from "@/lib/features/offers/use-offers-store";
import useLocalizer from "@/lib/hooks/use-localizer";
import { APIOfferProvider, APIOfferSubServiceProviderResponseType } from "@/lib/types/api/api-type";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone, UserSquare } from "lucide-react";
import React from "react";

interface OfferProviderDetailsDlgProps {
  isOpen: boolean;
  onClose: () => void;
  details?: APIOfferProvider;
}
const OfferProviderDetailsDlg: React.FC<OfferProviderDetailsDlgProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const { t , isRtl} = useLocalizer();
  const {getOfferProviderSubServices} = useOffersStore();
  const [providerServices,setProviderServices] = React.useState<Array<APIOfferSubServiceProviderResponseType> | undefined>([]);
  const [isLoading,setIsLoading] = React.useState<boolean>(false);

  const fetchServices = async ()=>{
  setIsLoading(true);
    if(details){
      const response = await getOfferProviderSubServices(details?.providerOfferId);
      if(response?.code == 0){
        setProviderServices(response?.data ?? [])
      }
    }
  setIsLoading(false);
  }

  React.useEffect(()=>{
    fetchServices();
    return ()=>{
      setProviderServices(undefined);
      setIsLoading(false);
    }
  },[details])

  const cols = React.useMemo((): ColumnDef<APIOfferSubServiceProviderResponseType>[] => {
    return [
      {
        accessorKey: "id",
        header: "#",
      },
      {
        header: t("labels.main_service"),
        cell: ({ row }) => {
          return <TruncatedSpan text={isRtl ? row?.original?.subServiceDetails?.mainServiceArDesc ?? "" : row?.original?.subServiceDetails?.mainServiceEnDesc ?? ""}/>
        },
      },
      {
        header: t("labels.sub_service"),
        cell: ({ row }) => {
          return <TruncatedSpan text={isRtl ? row?.original?.subServiceDetails?.arDesc ?? "" : row?.original?.subServiceDetails?.enDesc ?? ""}/>
        },
      },
    ];
  }, [details]);


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger />
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("titles.show_details")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {details?.personImg && (
            <div className="flex flex-col items-center justify-center p-2 w-full">
              <Avatar className="h-14 w-14 bg-gray-50">
                <AvatarImage src={details?.personImg ?? ""} />
                <AvatarFallback>
                  {details?.name?.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <Separator className="my-2 w-full" />
            </div>
          )}
          <DisplayInput label={t("labels.name")} value={details?.name ?? ""} prefixicon={<UserSquare/>}/>
          <DisplayInput label={t("labels.phone_number")} value={details?.phoneNumber ?? ""} prefixicon={<Phone/>}/>
          <DisplayInput label={t("labels.email")} value={details?.email ?? ""} prefixicon={<Mail/>}/>
          <TitleHeader
            className="h-12 rounded-none"
            title={t("titles.services")}
          />

          <DataTable
            ignorePagination
            isLoading={isLoading}
            columns={cols}
            data={providerServices ?? []}
          />

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferProviderDetailsDlg;
