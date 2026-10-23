import type { Metadata } from "next";
import { Suspense } from "react";
import HackathonDetailServerContainer from "@/container/project/ai-hackathon/detail/HackathonDetailServerContainer";
import { getProjectDetail, toSummary } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-hackathon/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return {
    title: {
      absolute: `${detail?.title ?? "해커톤 상세"} | hackable`,
    },
    description: detail ? toSummary(detail.bodyHtml) : "",
    alternates: {
      canonical: detail?.href ?? `/project/ai-hackathon/${id}`,
    },
  };
}

export default function HackathonDetail({ params }: PageProps<"/project/ai-hackathon/[id]">) {
  return (
    <Suspense>
      <HackathonDetailServerContainer params={params} />
    </Suspense>
  );
}
