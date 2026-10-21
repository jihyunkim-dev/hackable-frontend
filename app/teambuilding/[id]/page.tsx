import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuildingDetailServerContainer from "@/container/teambuilding/detail/TeamBuildingDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/teambuilding/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "팀빌딩 상세 | hackable",
    },
    description: "",
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
