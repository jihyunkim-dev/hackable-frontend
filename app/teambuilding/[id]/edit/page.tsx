import type { Metadata } from "next";
import { Suspense } from "react";
import TeamBuildingEditServerContainer from "@/container/teambuilding/edit/TeamBuildingEditServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/teambuilding/[id]/edit">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "팀빌딩 모집글 수정 | hackable",
    },
    description: "",
    alternates: {
      canonical: `/teambuilding/${id}/edit`,
    },
  };
}

export default function TeamBuildingEdit({ params }: PageProps<"/teambuilding/[id]/edit">) {
  return (
    <Suspense>
      <TeamBuildingEditServerContainer params={params} />
    </Suspense>
  );
}
