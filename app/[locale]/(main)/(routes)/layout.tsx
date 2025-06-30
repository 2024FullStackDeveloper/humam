import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { getMessages } from "next-intl/server";
import getServerLocale from "@/lib/utils/stuff-server";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import SessionWrapper from "@/lib/providers/session-wrapper";
import '@/lib/extensions/string-extensions';

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: "500",
  variable: "--tajawal",
});

export const metadata: Metadata = {
  title: "همام لادارة العمالة",
  description: "همام لادارة العمالة هو نظام متكامل لإدارة العمالة",
};

export default async function RootLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>) {
  const messages = await getMessages();
  const { dir, isRtl } = await getServerLocale();
  const locale = (await params).locale;

  return (
    <html 
    dir={dir} lang={locale}>
      <body className={`${tajawal.className} min-h-screen w-full  overflow-x-hidden`}>
        <React.StrictMode>
          <SessionWrapper>
          <NextIntlClientProvider 
          messages={messages}>
            <main className="min-h-screen w-full">{children}</main>
            <Toaster
              richColors
              closeButton
              dir={isRtl ? "rtl" : "ltr"}
              position={isRtl ? "top-right" : "top-left"}
            />
          </NextIntlClientProvider>
          </SessionWrapper>
        </React.StrictMode>
      </body>
    </html>
  );
}
