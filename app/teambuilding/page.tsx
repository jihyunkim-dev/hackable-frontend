import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuildingServerContainer from "@/container/teambuilding/TeamBuildingServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "팀빌딩 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/teambuilding",
  },
};

export default function TeamBuilding({ searchParams }: PageProps<"/teambuilding">) {
  return (
    // 검색 파라미터는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 "전체" 상태로 보여준다.
    <Suspense fallback={<TeamBuildingServerContainer />}>
      <TeamBuildingServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
