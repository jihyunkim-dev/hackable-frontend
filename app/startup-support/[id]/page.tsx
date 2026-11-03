import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import StartupSupportDetailServerContainer from "@/container/startup-support/detail/StartupSupportDetailServerContainer";
import { getGrantDetail, getGrantStaticParams } from "@/utils/grant";

// 최신 글은 빌드 때 본문까지 완성된 페이지로 만들고, 나머지는 첫 방문 때 만들어 저장한다. (utils/staticParams)
// 그래서 [id]를 Suspense 밖에서 기다려도 된다. Suspense로 감싸면 본문이 공통 틀(헤더·푸터) 뒤에 따로 와 첫 화면이 늦어진다.
export const generateStaticParams = getGrantStaticParams;

export async function generateMetadata({
  params,
}: PageProps<"/startup-support/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getGrantDetail(id);

  return pageMetadata({
    title: detailTitle(detail?.title ?? detailFallbackName.startupSupport),
    description: detail?.metaDescription ?? "",
    path: detail?.href ?? `/startup-support/${id}`,
  });
}

export default function StartupSupportDetail({
  params,
}: PageProps<"/startup-support/[id]">) {
  return <StartupSupportDetailServerContainer params={params} />;
}
