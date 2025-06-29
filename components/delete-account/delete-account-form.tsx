"use client";

import useLocalizer from "@/lib/hooks/use-localizer";
import TitleHeader from "../common/title-header";
import FormButton from "../common/form-button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import ResendOtp from "../common/resend-otp";
import { useSearchParams } from "next/navigation";
import React from "react";
import ApiAction from "@/lib/server/action";
import { APIVerifyUserResponseType } from "@/lib/types/api/api-type";
import { toast } from "sonner";

const DeleteAccountForm: React.FC<{}> = () => {
  const { t } = useLocalizer();
  const searchParams = useSearchParams();
  const tValue = React.useDeferredValue(searchParams?.get("t"));
  const [otp, setOtp] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [phoneNumber,setPhoneNumber] = React.useState<string | undefined>(undefined);


  const resendOtp = async ()=>{
    setLoading(true);
    try {
      const response = await ApiAction<APIVerifyUserResponseType>({
        controller:"user",
        method:"POST",
        url:"account/verify",
        authorized:true,
        manualToken:tValue ?? "",
      });


      if(!response?.isServerOn){
        toast.error(t(response?.serverOffMessage));
      }

      if(response?.result?.code == 0 && response?.result?.data?.sentOtp){
        setPhoneNumber(response?.result?.data?.phoneNumber);
        toast.success(response?.result?.message);
      }else if (response?.result?.code != 0) {
        toast.error(response?.result?.message);
      }

    } catch (err) {
      toast.error(t("errors.otp_send_failed"));
    } finally {
      setLoading(false);
    }
  }


  React.useEffect(() => { 
    if(tValue){
      resendOtp();
    }
  },[]);


  const onSubmit = async () => {

      if(phoneNumber){
      const response = await ApiAction<boolean>({
        controller: "user",
        method: "POST",
        url: `account/delete/${otp}`,
        authorized: true,
        manualToken: tValue ?? "",
      });

      if (!response?.isServerOn) {
        toast.error(t(response?.serverOffMessage));
      }

      if (response?.result?.code === 0 && response?.result?.data) {
        toast.success(response?.result?.message);
        setOtp(undefined);
        setPhoneNumber(undefined);
      } else {
        toast.error(response?.result?.message);
      }
    }else{
      toast.error(t("errors.otp_send_failed"));
    } 
  };

  return (
    <div className="border rounded-lg min-h-[400px] w-[460px] flex flex-col justify-between">
      <form
        autoComplete="off"
        action={onSubmit}
        className="flex flex-col h-full"
      >
        <div className="flex flex-col h-full">
          <TitleHeader title={t("titles.confirm_delete_account")} />
          <div className="flex flex-col p-5 gap-4">
            {
              phoneNumber && (
                <p className="text-sm md:text-[16px]">
                  {t("titles.otp_sent_to")} <span className="font-bold">{phoneNumber}</span>
                </p>
              )
            }
            <InputOTP disabled={loading} value={otp} onChange={setOtp} maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            <div className="flex flex-row items-center justify-center gap-2">
              <p className="text-sm md:text-[16px]">
                {t("paragraphs.otp_not_sent")}
              </p>
              <ResendOtp onClick={async () => {
                await resendOtp();
              }} />
            </div>
          </div>
        </div>
        <FormButton disabled={loading || !(otp?.length == 4)} title={t("buttons.save")} className="m-5" />
      </form>
    </div>
  );
};

export default DeleteAccountForm;
