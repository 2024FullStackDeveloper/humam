"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import useLocalizer from "@/lib/hooks/use-localizer";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
export interface LangSwitcherProps {
  className?: string;
  varient : "default" | "link" | "destructive" | "outline" | "secondary" | "ghost"
  tooltip?:string
};

const LangSwitcher = ({
  className,
  varient = "default",
  tooltip
}: LangSwitcherProps) => {
  const { isRtl, locale } = useLocalizer();
  const inverse = isRtl ? "En" : "ع";
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();

  const handleChangeLang = () => {
    const newLocale = locale == "ar" ? "en" : "ar";
    let currentPathName = pathname;
    if(params){
      currentPathName+=`?${params}`;
    }
    router.replace(currentPathName, { locale: newLocale });
  };

  return (
    <div>
      <Button
        title={tooltip}
        className={className}
        variant={varient}
        onClick={handleChangeLang}
      >
        {inverse}
      </Button>
    </div>
  );
};

export default LangSwitcher;
