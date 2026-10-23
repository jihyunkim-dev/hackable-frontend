import type { Metadata } from "next";
import { Suspense } from "react";
import StartupCompetitionDetailServerContainer from "@/container/project/startup-competition/detail/StartupCompetitionDetailServerContainer";
import { getProjectDetail, toSummary } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/startup-competition/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return {
    title: {
      absolute: `${detail?.title ?? "창업경진대회 상세"} | hackable`,
    },
    description: detail ? toSummary(detail.bodyHtml) : "",
    alternates: {
      canonical: detail?.href ?? `/project/startup-competition/${id}`,
    },
  };
}

export default function StartupCompetitionDetail({ params }: PageProps<"/project/startup-competition/[id]">) {
  return (
    <Suspense>
      <StartupCompetitionDetailServerContainer params={params} />
    </Suspense>
  );
}
