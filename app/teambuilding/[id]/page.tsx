import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuildingDetailServerContainer from "@/container/teambuilding/detail/TeamBuildingDetailServerContainer";
import { getTeamBuildingDetail } from "@/utils/teamBuilding";

export async function generateMetadata({
  params,
}: PageProps<"/teambuilding/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getTeamBuildingDetail(id);

  return {
    title: {
      absolute: `${detail?.title ?? "팀빌딩 상세"} | hackable`,
    },
    description: detail?.body.replace(/\s+/g, " ").trim().slice(0, 150) ?? "",
    alternates: {
      canonical: `/teambuilding/${id}`,
    },
  };
}

export default function TeamBuildingDetail({ params }: PageProps<"/teambuilding/[id]">) {
  return (
    <Suspense>
      <TeamBuildingDetailServerContainer params={params} />
    </Suspense>
  );
}
