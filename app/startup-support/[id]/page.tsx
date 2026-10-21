import type { Metadata } from "next";
import { Suspense } from "react";
import StartupSupportDetailServerContainer from "@/container/startup-support/detail/StartupSupportDetailServerContainer";

export async function generateMetadata({
  params,
}: PageProps<"/startup-support/[id]">): Promise<Metadata> {
  const { id } = await params;

  return {
    title: {
      absolute: "지원사업 상세 | hackable",
    },
    description: "",
    alternates: {
      canonical: `/startup-support/${id}`,
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
