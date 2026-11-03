import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import TeamBuildingServerContainer from "@/container/teambuilding/TeamBuildingServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.teamBuilding });

export default function TeamBuilding({
  searchParams,
}: PageProps<"/teambuilding">) {
  return (
    // 검색 파라미터는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 "전체" 상태로 보여준다.
    <Suspense fallback={<TeamBuildingServerContainer />}>
      <TeamBuildingServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
