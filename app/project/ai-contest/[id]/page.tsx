import type { Metadata } from "next";
import { Suspense } from "react";
import ContestDetailServerContainer from "@/container/project/ai-contest/detail/ContestDetailServerContainer";
import { getProjectDetail, toSummary } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-contest/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return {
    title: {
      absolute: `${detail?.title ?? "AI 공모전 상세"} | hackable`,
    },
    description: detail ? toSummary(detail.bodyHtml) : "",
    alternates: {
      canonical: detail?.href ?? `/project/ai-contest/${id}`,
    },
  };
}

export default function ContestDetail({ params }: PageProps<"/project/ai-contest/[id]">) {
  return (
    <Suspense>
      <ContestDetailServerContainer params={params} />
    </Suspense>
  );
}
