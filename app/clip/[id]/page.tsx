import type { Metadata } from "next";
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

  return {
    title: {
      absolute: `${data?.detail.title ?? "클립 상세"} | hackable`,
    },
    description: body?.type === "html" ? toSummary(body.html) : "",
    alternates: {
      canonical: `/clip/${id}`,
    },
  };
}

export default function ClipDetail({ params }: PageProps<"/clip/[id]">) {
  return (
    <Suspense>
      <ClipDetailServerContainer params={params} />
    </Suspense>
  );
}
