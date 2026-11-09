import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import TeamBuildingServerContainer from "@/container/teambuilding/TeamBuildingServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.teamBuilding });

export default function TeamBuilding({
  searchParams,
}: PageProps<"/teambuilding">) {
  // 주소에 따라 바뀌는 부분만 요청 때 채운다. (ServerBlock 안의 Suspense)
  // 페이지 전체를 1페이지 화면으로 대체해 두면 HTML에 H1·목록이 두 번 들어간다.
  return <TeamBuildingServerContainer searchParams={searchParams} />;
}
