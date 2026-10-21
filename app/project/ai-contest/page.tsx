import type { Metadata } from "next";
import { Suspense } from "react";
import ContestServerContainer from "@/container/project/ai-contest/ContestServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "AI 공모전 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/project/ai-contest",
  },
};

export default function Contest({ searchParams }: PageProps<"/project/ai-contest">) {
  return (
    // 검색 파라미터(page 등)는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 1페이지로 보여준다.
    <Suspense fallback={<ContestServerContainer />}>
      <ContestServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
