import type { Metadata } from "next";
import { Suspense } from "react";
import HackathonServerContainer from "@/container/project/ai-hackathon/HackathonServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "해커톤 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/project/ai-hackathon",
  },
};

export default function Hackathon({ searchParams }: PageProps<"/project/ai-hackathon">) {
  return (
    // 검색 파라미터(page 등)는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 1페이지로 보여준다.
    <Suspense fallback={<HackathonServerContainer />}>
      <HackathonServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
