import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import StartupCompetitionDetailServerContainer from "@/container/project/startup-competition/detail/StartupCompetitionDetailServerContainer";
import { getProjectDetail } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/startup-competition/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return pageMetadata({
    title: detailTitle(detail?.title ?? detailFallbackName.startupCompetition),
    description: detail?.metaDescription ?? "",
    path: detail?.href ?? `/project/startup-competition/${id}`,
  });
}

export default function StartupCompetitionDetail({
  params,
}: PageProps<"/project/startup-competition/[id]">) {
  return (
    <Suspense>
      <StartupCompetitionDetailServerContainer params={params} />
    </Suspense>
  );
}
