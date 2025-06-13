"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import useLocalizer from "@/lib/hooks/use-localizer";
import FormButton from "@/components/common/form-button";
import { toast } from "sonner";
import CheckboxList, { CheckboxItem } from "@/components/common/checkbox-list";
import {
  APIAdsResponseType,
  APIOfferProvider,
  APIOfferSubServiceProviderResponseType,
  APIProviderServiceType,
} from "@/lib/types/api/api-type";
import SelectList from "@/components/common/select-list";
import { useProviderServicesStore } from "@/lib/features/providers/use-providers-store";
import { DropdownType } from "@/lib/types/common-type";
import { useOffersStore } from "@/lib/features/offers/use-offers-store";
import TitleHeader from "@/components/common/title-header";
import OfferCard from "./offer-card";
import { orderBy } from "lodash";

interface UpdateOfferProviderServicesFormProps {
  isOpen: boolean;
  onClose: () => void;
  details?: APIOfferProvider;
  adsDetails?: APIAdsResponseType | null;
}

const UpdateOfferProviderServicesForm: React.FC<
  UpdateOfferProviderServicesFormProps
> = ({ isOpen, details, onClose }) => {
  const { t, isRtl } = useLocalizer();

  const { getActiveProviderServices } = useProviderServicesStore();
  const { getOfferProviderSubServices , deleteOfferProviderSubService , addOfferProviderSubServices} = useOffersStore();
  const [mainServices, setMainServices] = React.useState<
    Array<DropdownType<string>> | null | undefined
  >([]);
  const [serviceDetails, setServiceDetails] = React.useState<
    Array<APIProviderServiceType>
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedMainService, setSelectedMainService] = React.useState<
    string | undefined
  >(undefined);
  const [providerServices, setProviderServices] = React.useState<
    Array<APIOfferSubServiceProviderResponseType> | undefined
  >([]);
  const [selectedSubServices,setSelectedSubServices] = React.useState<Array<number>>([]);



  const fetchServices = async () => {
    setIsLoading(true);

    if (details) {
      const response = await Promise.all([
        getActiveProviderServices(details?.id ?? 0),
        getOfferProviderSubServices(details?.providerOfferId),
      ]);
      if (response[0]?.code == 0) {
        setServiceDetails(response[0].data ?? []);
        setMainServices(
          response[0]?.data?.map<DropdownType<string>>((e) => ({
            id: e.id.toString(),
            arDesc: e.arDesc,
            enDesc: e.enDesc,
          }))
        );
      }
      if (response[1]?.code == 0) {
        setProviderServices(orderBy(response[1]?.data ?? [],"id"));
      }
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    setSelectedSubServices([]);
    setSelectedMainService(undefined);
    setMainServices([]);
    setServiceDetails([]);
    setProviderServices([]);
    fetchServices();
    return () => {
      setMainServices([]);
      setIsLoading(false);
      setSelectedSubServices([]);
    };
  }, [details]);

  const handleSubmit = async () => {

    if(selectedSubServices?.length == 0)
      return;

    const response = await addOfferProviderSubServices(details?.providerOfferId ?? 0, selectedSubServices);
    if (!response?.isServerOn) {
      toast.error(t(response?.serverOffMessage));
      return;
    }
    if (response?.code == 0 && response?.data) {
      toast.success(response?.message);
      onClose();
    }else{
      toast.error(response?.message);
    }
  };

  React.useEffect(() => {
    return () => {
      setSelectedMainService(undefined);
      setMainServices([]);
      setServiceDetails([]);
      setProviderServices([]);
    };
  }, []);

  const subServices = React.useMemo((): Array<CheckboxItem> => {
    if (selectedMainService) {
      const servicesResult = serviceDetails?.find((e) => e.id.toString() == selectedMainService)?.subServiceList;
      let result : CheckboxItem[] = [];
      if(providerServices){
        const services =  providerServices?.flatMap(e=>({mainServiceId:e.subServiceDetails?.mainServiceId,subServiceId:e.subServiceDetails?.id}));
        result = servicesResult?.filter(e=>!services.some(ee=>ee.mainServiceId?.toString() == selectedMainService && ee.subServiceId == e.id))
         .map<CheckboxItem>((e) => ({
          id: e.id.toString(),
          label: isRtl ? e.arDesc : e.enDesc,
          checked: false,
        })) ?? [];
      }else{
        result = servicesResult?.map<CheckboxItem>((e) => ({
          id: e.id.toString(),
          label: isRtl ? e.arDesc : e.enDesc,
          checked: false,
        })) ?? [];
      }
      return result ?? [];
    }
    return [];
  }, [mainServices, serviceDetails, selectedMainService,providerServices]);


  const handleDeleteSubService = async (id: number ,  providerId : number , subServiceId : number)=>{
    const result = await deleteOfferProviderSubService(providerId,subServiceId);

    if (!result?.isServerOn) {
      toast.error(t(result?.serverOffMessage));
      return;
    }
    if (result?.code == 0 && result) {
      toast.success(result?.message);
      setProviderServices(orderBy([...providerServices?.filter(e=> e.id !== id) ?? []] ,"id"))
    } else {
      toast.error(result?.message);
    }
  };

  

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("titles.update")}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <form action={handleSubmit} className="space-y-6 flex flex-col gap-4">
            <SelectList
              label={t("labels.main_service")}
              placeholder={t("placeholders.main_service")}
              options={mainServices ?? []}
              prefixicon={<Info />}
              loading={isLoading}
              onValueChange={setSelectedMainService}
            />

            <CheckboxList
              items={subServices ?? []}
              title={t("titles.sub_services")}
              onItemChange={(id, checked) => {
                if(checked){
                  setSelectedSubServices([...selectedSubServices, parseInt(id)])
                }else{
                  setSelectedSubServices([...selectedSubServices?.filter(e=>e.toString() !== id.toString())])
                }
              }}
            />

            {providerServices && providerServices?.length > 0 && (
              <>
                <TitleHeader
                  title={t("titles.linked_sub_services")}
                  className="h-12 rounded-none"
                />
                <div className="flex flex-col gap-2">
                {providerServices?.map((e) => (
                  <OfferCard
                    key={e.id}
                    data={e}
                    onRemove={handleDeleteSubService}
                  />
                ))}
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                }}
              >
                {t("buttons.cancel")}
              </Button>
              <FormButton title={t("buttons.save")} />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateOfferProviderServicesForm;
