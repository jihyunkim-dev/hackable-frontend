import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import TeamBuildingEditServerContainer from "@/container/teambuilding/edit/TeamBuildingEditServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/teambuilding/[id]/edit">): Promise<Metadata> {
  const { id } = await params;

  return pageMetadata({
    ...seoContent.teamBuildingEdit,
    path: `/teambuilding/${id}/edit`,
    noindex: true,
  });
}

export default function TeamBuildingEdit({
  params,
}: PageProps<"/teambuilding/[id]/edit">) {
  return (
    <Suspense>
      <TeamBuildingEditServerContainer params={params} />
    </Suspense>
  );
}
