import type { Metadata } from "next";
import { Suspense } from "react";
import ContestDetailServerContainer from "@/container/project/ai-contest/detail/ContestDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-contest/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "AI 공모전 상세 | hackable",
    },
    description: "",
    alternates: {
      canonical: `/project/ai-contest/${id}`,
    },
  };
}

export default function ContestDetail({ params }: PageProps<"/project/ai-contest/[id]">) {
  return (
    <Suspense>
      <ContestDetailServerContainer params={params} />
    </Suspense>
  );
}
