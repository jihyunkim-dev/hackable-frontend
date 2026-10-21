import type { Metadata } from "next";
import { Suspense } from "react";
import StartupCompetitionDetailServerContainer from "@/container/project/startup-competition/detail/StartupCompetitionDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/project/startup-competition/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "창업경진대회 상세 | hackable",
    },
    description: "",
    alternates: {
      canonical: `/project/startup-competition/${id}`,
    },
  };
}

export default function StartupCompetitionDetail({ params }: PageProps<"/project/startup-competition/[id]">) {
  return (
    <Suspense>
      <StartupCompetitionDetailServerContainer params={params} />
    </Suspense>
  );
}
