import type { Metadata } from "next";
import { detailFallbackName } from "@/configs/contents/seo";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import StartupSupportDetailServerContainer from "@/container/startup-support/detail/StartupSupportDetailServerContainer";
import { getGrantDetail } from "@/utils/grant";

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
  return (
    <Suspense>
      <StartupSupportDetailServerContainer params={params} />
    </Suspense>
  );
}
