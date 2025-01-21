"use client";
import { TranslationValues, useLocale, useTranslations } from "next-intl";
const useLocalizer = () => {
  const t = useTranslations();
  const locale = useLocale();

  const translate = (msg?: string, options?: TranslationValues): string => {
    if (!msg?.includes(" ")) return t(msg, options);
    return msg ?? "";
  };

  const isRtl = (locale?.toLowerCase() || "ar") == "ar";
  return { locale, isRtl, t: translate };
};
export default useLocalizer;
