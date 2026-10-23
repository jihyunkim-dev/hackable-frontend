import type { Metadata } from "next";
import { Suspense } from "react";
import StartupSupportDetailServerContainer from "@/container/startup-support/detail/StartupSupportDetailServerContainer";
import { getGrantDetail } from "@/utils/grant";
import { toSummary } from "@/utils/project";

export async function generateMetadata({
  params,
}: PageProps<"/startup-support/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getGrantDetail(id);

  return {
    title: {
      absolute: `${detail?.title ?? "지원사업 상세"} | hackable`,
    },
    description: detail ? toSummary(detail.bodyHtml) : "",
    alternates: {
      canonical: detail?.href ?? `/startup-support/${id}`,
    },
  };
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
