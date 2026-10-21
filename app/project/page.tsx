import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectServerContainer from "@/container/project/ProjectServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "프로젝트 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/project",
  },
};

export default function Project({ searchParams }: PageProps<"/project">) {
  return (
    // 검색 파라미터(page 등)는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 1페이지로 보여준다.
    <Suspense fallback={<ProjectServerContainer />}>
      <ProjectServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
