import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import HackathonDetailServerContainer from "@/container/project/ai-hackathon/detail/HackathonDetailServerContainer";
import { getProjectDetail } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-hackathon/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetail(id);

  return pageMetadata({
    title: detailTitle(detail?.title ?? detailFallbackName.aiHackathon),
    description: detail?.metaDescription ?? "",
    path: detail?.href ?? `/project/ai-hackathon/${id}`,
  });
}

export default function HackathonDetail({
  params,
}: PageProps<"/project/ai-hackathon/[id]">) {
  return (
    <Suspense>
      <HackathonDetailServerContainer params={params} />
    </Suspense>
  );
}
