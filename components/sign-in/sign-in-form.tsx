"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import TitleHeader from "../common/title-header";
import { Input } from "../ui/input";
import { LockKeyhole, UserSquareIcon } from "lucide-react";
import TextButton from "../common/text-button";
import { useRouter } from "@/i18n/routing";
import FormButton from "../common/form-button";
import { LoginSchema } from "@/lib/schemas/authorization-schema";
import z from "zod";
import React from "react";
import { APILoginResponseType, APIResponseType } from "@/lib/types/api/api-type";
import { toast } from "sonner";
import { validateAPIErrors, validateData } from "@/lib/utils/stuff-client";
import { signIn } from "next-auth/react";
import { GlobalResponseType } from "@/lib/types/common-type";

const SignInForm = () => {
  const { t } = useLocalizer();
  const router = useRouter();
  const [request,setRequest] = React.useState<z.infer<typeof LoginSchema>>({emailOrPhoneNumber:'',password:''});
  const [errors,setErrors] = React.useState<any | undefined>(undefined);
  const onSubmit = async ()=>{
    const {errorsList,isValid} = validateData(LoginSchema,request);
    if(!isValid){
      setErrors(errorsList);
      return;
    }
    try{
    const response = await signIn("credentials",{...request,redirect:false});
    if(response?.ok){
       router.replace("/dashboard");
       router.refresh();
       return;
    }else if(response?.error){
      const error = JSON.parse(response?.error) as GlobalResponseType<APIResponseType<APILoginResponseType>>;
     if(!error?.isServerOn){
      toast.error(t(error.serverOffMessage));
      return;
    }else if (error?.result?.code != 0 && !error?.result?.fields){
      toast.error(error.result?.message);
    }else if(error?.result?.fields){
      toast.error(error.result?.message);
      setErrors(validateAPIErrors(error?.result?.fields));
    }
  }

  }catch(e){
    console.log(`Something wrong occured once signIn`,e);
  }
  }

  return (
    <div className="border rounded-lg min-h-[400px] w-[460px] flex flex-col justify-between">
      <form 
      autoComplete="off" 
      action={onSubmit}>
        <div className="flex flex-col">
          <TitleHeader title={t("titles.platform_management")} />
          <div className="flex flex-col p-5 gap-4">
            <Input
              maxLength={256}
              value={request?.emailOrPhoneNumber}
              label={t("labels.phone_or_email")}
              placeholder={t("placeholders.phone_or_email")}
              prefixicon={<UserSquareIcon />}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,emailOrPhoneNumber:value});
                setErrors(validateData(LoginSchema,{...request,emailOrPhoneNumber:value})?.errorsList);
              }}
              error={errors?.emailOrPhoneNumber && t(errors?.emailOrPhoneNumber[0])}
            />
            <Input
              maxLength={256}
              value={request?.password}
              type="password"
              label={t("labels.password")}
              placeholder={t("placeholders.password")}
              prefixicon={<LockKeyhole />}
              onChange={({currentTarget:{value}})=>{
                setRequest({...request,password:value});
                setErrors(validateData(LoginSchema,{...request,password:value})?.errorsList);
              }}
              error={errors?.password && t(errors?.password[0])}
            />
            <TextButton
              onClick={() => {
                router.push("/forget-password");
              }}
            >
              {t("buttons.forget_password")}
            </TextButton>
          </div>
          <FormButton title={t("buttons.sign_in")} className="m-5" />
        </div>
      </form>
    </div>
  );
};

export default SignInForm;

