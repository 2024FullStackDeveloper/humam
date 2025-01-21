"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import TitleHeader from "../common/title-header";
import PhoneNumberInput from "../common/phone-number-input";
import { useRouter } from "@/i18n/routing";
import React from "react";
import { Input } from "../ui/input";
import { LockKeyhole } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import ResendOtp from "../common/resend-otp";
import FormButton from "../common/form-button";
import z from "zod";
import { ChangePasswordSchema, VerifyPhoneNumberSchema } from "@/lib/schemas/authorization-schema";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import ApiAction from "@/lib/server/action";
import { APIVerifyUserResponseType } from "@/lib/types/api/api-type";
import { toast } from "sonner";

const ForgetPasswordForm = () => {
  const { t } = useLocalizer();
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [verifyPhoneNumberRequest, setVerifyPhoneNumberRequest] =
    React.useState<z.infer<typeof VerifyPhoneNumberSchema>>({
      phoneNumber: "",
    });
  const [errors, setErrors] = React.useState<any | undefined>(undefined);
  const [frazed,setFrazed] = React.useState<boolean>(false);
  const [changePasswordRequest,setChangePasswordRequest] = React.useState<z.infer<typeof ChangePasswordSchema>>({phoneNumber:'',otp:'',newPassword:''});

  React.useEffect(()=>{
    if(changePasswordRequest.otp.length != 4){
      setFrazed(true);
      return;
    }
    setFrazed(false);
  },[changePasswordRequest]);



  const renderContent = React.useMemo((): React.JSX.Element => {
    switch (step) {
      case 0:
      default:
        return (
          <form
            action={async () => {
              setErrors(undefined);
              const validate = validateData(
                VerifyPhoneNumberSchema,
                verifyPhoneNumberRequest
              );

              if (!validate.isValid) {
                setErrors(validate.errorsList);
                return;
              }
              const phoneNumber = verifyPhoneNumberRequest.phoneNumber
              .replace("+", "")
              .replace(" ", "");

              const response = await ApiAction<APIVerifyUserResponseType>({
                controller: "user",
                url: "verify_user",
                method: "POST",
                body: {
                  ...verifyPhoneNumberRequest,
                  phoneNumber: phoneNumber,
                },
              });
              if (response?.result?.code == 0) {
                toast.success(response.result.message);
                setChangePasswordRequest({...changePasswordRequest,phoneNumber:phoneNumber});
                setStep(1);
              } else if (!response.isServerOn) {
                toast.error(t(response.serverOffMessage));
              } else if (
                response?.result?.code != 0 &&
                !response?.result?.fields
              ) {
                toast.error(response.result?.message);
              } else if (response?.result?.fields) {
                setErrors(validateAPIErrors(response.result?.fields));
              }
            }}
            className="h-full flex flex-col justify-between"
          >
            <div className="flex flex-col">
              <TitleHeader
                showTailing
                title={t("titles.verify_account")}
                onClick={() => {
                  router.back();
                }}
              />
              <div className="flex flex-col p-5 gap-4">
                <PhoneNumberInput
                  label={t("placeholders.phone_number")}
                  value={verifyPhoneNumberRequest?.phoneNumber}
                  onValueChange={(value) => {
                    setErrors(validateData(
                      VerifyPhoneNumberSchema,
                      {phoneNumber:value ?? ""}
                    )?.errorsList);
                    setVerifyPhoneNumberRequest({ phoneNumber: value ?? "" });
                  }}
                  error={errors?.phoneNumber && t(errors?.phoneNumber[0])}
                />
              </div>
            </div>
            <FormButton title={t("buttons.next")} className="m-5" />
          </form>
        );
      case 1:
        return (
          <form 
          action={async()=>{
            setErrors(undefined);
              const validate = validateData(
                ChangePasswordSchema,
                changePasswordRequest
              );

              if (!validate.isValid) {
                setErrors(validate.errorsList);
                return;
              }

              const response = await ApiAction<boolean>({
                controller: "user",
                url: "change_password",
                method: "POST",
                body: changePasswordRequest,
              });
              if (response?.result?.code == 0) {
                toast.success(response.result.message);
                router.replace("/sign-in");
                router.refresh();
                
              } else if (!response.isServerOn) {
                toast.error(t(response.serverOffMessage));
              } else if (
                response?.result?.code != 0 &&
                !response?.result?.fields
              ) {
                toast.error(response.result?.message);
              } else if (response?.result?.fields) {
                setErrors(validateAPIErrors(response.result?.fields));
              }


          }}           
           className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
              <TitleHeader
                showTailing
                title={t("titles.reset_password")}
                onClick={() => {
                  setStep(0);
                }}
              />
              <div className="flex flex-col p-5 gap-4">
                <InputOTP onChange={(value)=>{
                  setChangePasswordRequest({...changePasswordRequest,otp:value});
                }} maxLength={4}>
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
                  <ResendOtp
                    onClick={async () => {
                      const response =
                        await ApiAction<APIVerifyUserResponseType>({
                          controller: "user",
                          url: "verify_user",
                          method: "POST",
                          body: {
                            ...verifyPhoneNumberRequest,
                            phoneNumber: verifyPhoneNumberRequest.phoneNumber
                              .replace("+", "")
                              .replace(" ", ""),
                          },
                        });
                      if (response?.result?.code == 0) {
                        toast.success(response.result.message);
                      } else if (!response.isServerOn) {
                        toast.error(t(response.serverOffMessage));
                      }
                    }}
                  />
                </div>
                <Input
                  type="password"
                  autoComplete="on"
                  disabled={frazed}
                  label={t("labels.new_password")}
                  placeholder={t("placeholders.new_password")}
                  prefixicon={<LockKeyhole />}
                  onChange={({currentTarget:{value}})=>{
                    setErrors(validateData(
                      ChangePasswordSchema,
                      {...changePasswordRequest,newPassword:value ?? ""}
                    )?.errorsList);
                    setChangePasswordRequest({...changePasswordRequest,newPassword:value});
                  }}
                  error={errors?.newPassword && t(errors?.newPassword[0])}
                />
              </div>
            </div>
            <FormButton disabled={frazed} title={t("buttons.save")} className="m-5" />
          </form>
        );
    }
    return <></>;
  }, [step, verifyPhoneNumberRequest,changePasswordRequest, frazed, errors]);

  return (
    <div className="border rounded-lg min-h-[400px] w-[460px]">
      {renderContent}
    </div>
  );
};
export default ForgetPasswordForm;
