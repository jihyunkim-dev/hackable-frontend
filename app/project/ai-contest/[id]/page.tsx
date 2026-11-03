import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import ContestDetailServerContainer from "@/container/project/ai-contest/detail/ContestDetailServerContainer";
import { getProjectDetail } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-contest/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return pageMetadata({
    title: detailTitle(detail?.title ?? detailFallbackName.aiContest),
    description: detail?.metaDescription ?? "",
    path: detail?.href ?? `/project/ai-contest/${id}`,
  });
}

export default function ContestDetail({
  params,
}: PageProps<"/project/ai-contest/[id]">) {
  return (
    <Suspense>
      <ContestDetailServerContainer params={params} />
    </Suspense>
  );
}
