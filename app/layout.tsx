import type { Metadata } from "next";
import "./globals.css";
import { hackableSans } from "./font";
import { cn } from "@/lib/utils";
import { seoContent } from "@/configs/contents/seo";
import { siteUrl } from "@/configs/urls";
import { pageMetadata } from "@/utils/metadata";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import FloatingButton from "@/components/layout/FloatingButton";
import QueryProvider from "@/components/layout/QueryProvider";
import {
  GlobalAlertModal,
  GlobalSignInModal,
} from "@/components/layout/GlobalModals";

// 사이트 기본값. 페이지마다 utils/metadata의 pageMetadata로 덮어쓴다.
// metadataBase: canonical·og:url 같은 상대 주소를 운영 주소 기준 절대 주소로 바꾼다.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(seoContent.home),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={cn(hackableSans.variable, "h-full antialiased")}>
      <body
        className={cn(
          "min-h-full flex flex-col font-sans",
          "pb-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom))] md:pb-0",
        )}
      >
        <QueryProvider>
          <Header />
          <main className="flex-1 pt-(--header-height-mobile) md:pt-(--header-height-desktop)">
            {children}
          </main>
          <Footer />
          <FloatingButton />
          <GlobalSignInModal />
          <GlobalAlertModal />
        </QueryProvider>
      </body>
    </html>
  );
}
