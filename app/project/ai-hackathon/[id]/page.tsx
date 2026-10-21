import type { Metadata } from "next";
import { Suspense } from "react";
import HackathonDetailServerContainer from "@/container/project/ai-hackathon/detail/HackathonDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/project/ai-hackathon/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "해커톤 상세 | hackable",
    },
    description: "",
    alternates: {
      canonical: `/project/ai-hackathon/${id}`,
    },
  };
}

export default function HackathonDetail({ params }: PageProps<"/project/ai-hackathon/[id]">) {
  return (
    <Suspense>
      <HackathonDetailServerContainer params={params} />
    </Suspense>
  );
}
