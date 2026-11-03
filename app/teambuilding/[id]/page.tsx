import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import {
  detailTitle,
  pageMetadata,
  teamBuildingMetaDescription,
} from "@/utils/metadata";
import { Suspense } from "react";
import TeamBuildingDetailServerContainer from "@/container/teambuilding/detail/TeamBuildingDetailServerContainer";
import { getTeamBuildingDetail } from "@/utils/teamBuilding";

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
  return (
    <Suspense>
      <TeamBuildingDetailServerContainer params={params} />
    </Suspense>
  );
}
