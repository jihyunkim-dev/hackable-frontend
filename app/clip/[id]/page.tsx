import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import ClipDetailServerContainer from "@/container/clip/detail/ClipDetailServerContainer";
import { getClipDetail } from "@/utils/clip";
import { toSummary } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/clip/[id]">): Promise<Metadata> {
  const { id } = await params;
  const data = await getClipDetail(id);
  const body = data?.detail.blocks.find((block) => block.type === "html");

  // TODO: 정보구조 문서는 "글마다 직접 작성"한 설명을 쓴다. 백엔드에 설명 필드가 생기기 전까지 본문 요약을 쓴다.
  return pageMetadata({
    title: detailTitle(data?.detail.title ?? detailFallbackName.clip),
    description: body?.type === "html" ? toSummary(body.html) : "",
    path: `/clip/${id}`,
  });
}

export default function ClipDetail({ params }: PageProps<"/clip/[id]">) {
  return (
    <Suspense>
      <ClipDetailServerContainer params={params} />
    </Suspense>
  );
}
