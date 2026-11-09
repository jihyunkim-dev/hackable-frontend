import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import StartupCompetitionServerContainer from "@/container/project/startup-competition/StartupCompetitionServerContainer";

export const metadata: Metadata = pageMetadata({
  ...seoContent.startupCompetition,
});

export default function StartupCompetition({
  searchParams,
}: PageProps<"/project/startup-competition">) {
  // 주소에 따라 바뀌는 부분만 요청 때 채운다. (ServerBlock 안의 Suspense)
  // 페이지 전체를 1페이지 화면으로 대체해 두면 HTML에 H1·목록이 두 번 들어간다.
  return <StartupCompetitionServerContainer searchParams={searchParams} />;
}
