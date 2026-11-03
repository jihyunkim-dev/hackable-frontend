import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import {
  detailTitle,
  pageMetadata,
  teamBuildingMetaDescription,
} from "@/utils/metadata";
import TeamBuildingDetailServerContainer from "@/container/teambuilding/detail/TeamBuildingDetailServerContainer";
import {
  getTeamBuildingDetail,
  getTeamBuildingStaticParams,
} from "@/utils/teamBuilding";

// 최신 글은 빌드 때 본문까지 완성된 페이지로 만들고, 나머지는 첫 방문 때 만들어 저장한다. (utils/staticParams)
// 그래서 [id]를 Suspense 밖에서 기다려도 된다. Suspense로 감싸면 본문이 공통 틀(헤더·푸터) 뒤에 따로 와 첫 화면이 늦어진다.
export const generateStaticParams = getTeamBuildingStaticParams;

export async function generateMetadata({
  params,
}: PageProps<"/teambuilding/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getTeamBuildingDetail(id);

  return pageMetadata({
    title: detailTitle(detail?.title ?? detailFallbackName.teamBuilding),
    description: detail ? teamBuildingMetaDescription(detail) : "",
    path: `/teambuilding/${id}`,
  });
}

export default function TeamBuildingDetail({
  params,
}: PageProps<"/teambuilding/[id]">) {
  return <TeamBuildingDetailServerContainer params={params} />;
}
