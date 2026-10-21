import type { Metadata } from "next";
import { Suspense } from "react";
import ClipDetailServerContainer from "@/container/clip/detail/ClipDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/clip/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "클립 상세 | hackable",
    },
    description: "",
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
