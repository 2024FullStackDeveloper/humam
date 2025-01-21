"use client";
import Image from "next/image";
import LangSwitcher from "../common/lang-switcher";
import useLocalizer from "@/lib/hooks/use-localizer";
const SignInWrapper = ({
  appName = "Humam",
  children,
}: React.PropsWithChildren<{
  appName?: string;
}>) => {
  const {t} = useLocalizer();

  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 min-h-screen">
      <div className="bg-primary w-full h-full flex flex-col justify-center items-center">
        <div className="relative  w-full h-full bg-[url('/assets/net.svg')] bg-contain bg-no-repeat bg-center flex flex-col justify-center items-center gap-4">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            width={300}
            height={200}
            className="!w-[30%] h-auto"
            priority
          />
          <span className="text-destructive font-bold !text-5xl mb-2">
            {appName}
          </span>
        </div>
      </div>
      <div className="flex flex-col h-full">
        <LangSwitcher varient={"default"} className="m-5" />
        <div className="grow flex flex-col justify-between">
          <div className="grow flex flex-col justify-center items-center">
            {children}
          </div>
          <footer className="bg-secondary/10 h-10 w-full flex justify-center items-center">
            <p>
              {t("phases.copy_rights")}{" "}
              <span className="text-primary font-bold">Humam</span>
              <bdi>
                <code className="mx-1">{new Date().getFullYear()}</code>
              </bdi>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
export default SignInWrapper;
