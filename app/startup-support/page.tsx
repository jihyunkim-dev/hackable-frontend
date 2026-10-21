import type { Metadata } from "next";
import { Suspense } from "react";
import StartupSupportServerContainer from "@/container/startup-support/StartupSupportServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "지원사업 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/startup-support",
  },
};

export default function StartupSupport({ searchParams }: PageProps<"/startup-support">) {
  return (
    // 검색 파라미터(page 등)는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 1페이지로 보여준다.
    <Suspense fallback={<StartupSupportServerContainer />}>
      <StartupSupportServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
