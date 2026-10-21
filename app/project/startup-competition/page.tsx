import type { Metadata } from "next";
import { Suspense } from "react";
import StartupCompetitionServerContainer from "@/container/project/startup-competition/StartupCompetitionServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "창업경진대회 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/project/startup-competition",
  },
};

export default function StartupCompetition({ searchParams }: PageProps<"/project/startup-competition">) {
  return (
    // 검색 파라미터(page 등)는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 1페이지로 보여준다.
    <Suspense fallback={<StartupCompetitionServerContainer />}>
      <StartupCompetitionServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
