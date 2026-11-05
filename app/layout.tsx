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
  // 검색엔진 사이트 소유 확인 (네이버 서치어드바이저). 페이지 메타데이터가 덮어쓰지 않아 모든 페이지에 붙는다.
  // 계정마다 코드가 달라 여러 개를 넣는다. (배열이면 meta 태그가 하나씩 생긴다)
  verification: {
    other: {
      "naver-site-verification": [
        "b30f85645946a215a36d521ac52fc0fbfc87384f",
        "7c71c12ad7a38914a497b8379d14c7706af57699",
        "cfa8d1f695908a7629ac5abadfa41dbad2e5a596",
      ],
    },
  },
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
