import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import HackathonDetailServerContainer from "@/container/project/ai-hackathon/detail/HackathonDetailServerContainer";
import { getProjectDetail, getProjectStaticParams } from "@/utils/project";

export const generateStaticParams = () => getProjectStaticParams("hackathon");

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
  return <HackathonDetailServerContainer params={params} />;
}
