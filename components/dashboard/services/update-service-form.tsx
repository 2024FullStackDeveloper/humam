"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Info } from "lucide-react";
import SubServiceForm from "./sub-service-form";
import FileUploader from "@/components/common/file-uploader";
import useLocalizer from "@/lib/hooks/use-localizer";
import z from "zod";
import { IEditSubService, IPatchMainService, ISubService } from "@/lib/schemas/services-schema";
import SubServiceCard from "./sub-service-card";
import FormButton from "@/components/common/form-button";
import { max } from "lodash";
import { useServicesStore } from "@/lib/features/services/use-services-store";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import { toast } from "sonner";
import { APIMainServiceResponseType } from "@/lib/types/api/api-type";

interface UpdateServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  service?: APIMainServiceResponseType | null;
}

const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  service,
}) => {
  const { t } = useLocalizer();
  const initial = {
    ...service,
    serviceImg : service?.serviceImg ?? undefined
  };
  const [request, setRequest] = useState<z.infer<typeof IPatchMainService>>(initial);
  const [isSubServiceFormOpen, setIsSubServiceFormOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState< z.infer<typeof IEditSubService> | undefined>(undefined);
  const [errors,setErrors] = React.useState<any | undefined>(undefined);
  const {patchMainService,addSubService} = useServicesStore();

  React.useLayoutEffect(()=>{
    setErrors(undefined);
    setRequest(initial)
  },[service]);

  const maxSubServices = React.useMemo(() : number=>{
    if(request?.subServices && request?.subServices?.length > 0){
        const ids = request?.subServices.map(e=>(e.id))
        return max(ids) ?? 0;
    }
    return 0;
  },[request]);


  const handleSubmit = async () => {
    setErrors(undefined);

    const validate = validateData(
        IPatchMainService,
        request
      );

    if (!validate.isValid) {
      setErrors(validate.errorsList);
      return;
    }

    if(service?.id){
    const response = await patchMainService(service?.id ?? 0,request);
    if(!response?.isServerOn){
      toast.error(t(response?.serverOffMessage));
      return;
    }

    if(response?.fields){
      setErrors(validateAPIErrors(response?.fields))
      return;
    }

    if(response?.code == 0 && response?.data){


    if(request?.subServices && request?.subServices?.length > 0){
      await addSubService(response?.data?.id ?? 0,request?.subServices);
    }

      toast.success(response?.message);
      setRequest(initial);
      onSubmit();
      setErrors(undefined);
      onClose();
    }
    }
  };

  const handleSubServiceSubmit = (subService: z.infer<typeof ISubService>) => {
    if (editingSubService) {
      setRequest({
        ...request,
        subServices: request?.subServices?.map((sub) =>
          sub.id === subService.id ? subService : sub
        ),
      });
    } else {
      setRequest((prev) => ({
        ...prev,
        subServices: [...prev?.subServices ?? [], subService],
      }));
    }
    setEditingSubService(undefined);
  };

  const removeSubService = (subServiceId: number) => {
    setRequest((prev) => ({
      ...prev,
      subServices: prev?.subServices?.filter((sub) => sub.id !== subServiceId),
    }));
  };

  const openCreateSubServiceForm = () => {
    setEditingSubService(undefined);
    setIsSubServiceFormOpen(true);
  };

  const openEditSubServiceForm = (subService: z.infer<typeof ISubService>) => {
    setEditingSubService(subService);
    setIsSubServiceFormOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("titles.update")}
            </DialogTitle>
            <DialogDescription/>
          </DialogHeader>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FileUploader
                    type="image"
                    path={request?.serviceImg}
                    label={t("labels.service_image")}
                    onChange={(file) => {
                       setRequest({ ...request, serviceFile: file });
                       console.log(file);
                    }}
                    error={(errors?.serviceFile && t(errors?.serviceFile[0])) || (errors?.ServiceFile && t(errors?.ServiceFile[0]))}
                  />
                </div>
              </div>
            </div>

            {/* Service Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="arDesc"
                  value={request?.arDesc}
                  onChange={({currentTarget:{value}}) =>{
                    setRequest({...request,arDesc:value})
                  }}
                  required
                  label={t("labels.ar_desc")}
                  placeholder={t("placeholders.ar_desc")}
                  prefixicon={<Info />}
                  error={errors?.arDesc && t(errors?.arDesc[0])}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="enDesc"
                  value={request?.enDesc}
                 onChange={({currentTarget:{value}}) =>{
                    setRequest({...request,enDesc:value})
                  }}
                  required
                  dir="rtl"
                  label={t("labels.en_desc")}
                  placeholder={t("placeholders.en_desc")}
                  prefixicon={<Info />}
                  error={errors?.enDesc && t(errors?.enDesc[0])}
                />
              </div>
            </div>

            {/* Sub-services */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t("titles.sub_services")}</Label>
                <Button
                  type="button"
                  onClick={openCreateSubServiceForm}
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-2">
                {request?.subServices?.map((subService,index) => (
                  <SubServiceCard 
                  key={index + 1}
                  subService={subService} 
                  onStatusChange={(id,checked)=>{
                    const statusValue = request?.subServices?.find(e=>e.id == id);
                    if(statusValue){
                    statusValue.stopEnabled = checked;
                    setRequest({
                      ...request,
                      subServices:[...request?.subServices?.filter(e=>e.id !== id) ?? [],statusValue]
                    })
                    }
                  }}
                  onEditSubService={(data)=>{
                    openEditSubServiceForm(data);
                  }}
                  onRemoveSubService={(id)=>{
                    removeSubService(id);
                  }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={()=>{
                onClose();
              }}>
                {t("buttons.cancel")}
              </Button>
              <FormButton title={t("buttons.save")}/>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

       <SubServiceForm
        isOpen={isSubServiceFormOpen}
        subService={editingSubService}
        onClose={() => setIsSubServiceFormOpen(false)}
        onSubmit={handleSubServiceSubmit}
        mode={ editingSubService ? "edit" : "create"} 
        maxId={maxSubServices}/>
    </>
  );
};

export default UpdateServiceForm;

