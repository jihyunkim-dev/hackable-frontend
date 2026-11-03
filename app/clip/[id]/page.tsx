import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import ClipDetailServerContainer from "@/container/clip/detail/ClipDetailServerContainer";
import { getClipDetail, getClipStaticParams } from "@/utils/clip";
import { toSummary } from "@/utils/project";

// 최신 글은 빌드 때 본문까지 완성된 페이지로 만들고, 나머지는 첫 방문 때 만들어 저장한다. (utils/staticParams)
// 그래서 [id]를 Suspense 밖에서 기다려도 된다. Suspense로 감싸면 본문이 공통 틀(헤더·푸터) 뒤에 따로 와 첫 화면이 늦어진다.
export const generateStaticParams = getClipStaticParams;

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
    path: data?.detail.href ?? `/clip/${id}`,
  });
}

export default function ClipDetail({ params }: PageProps<"/clip/[id]">) {
  return <ClipDetailServerContainer params={params} />;
}
