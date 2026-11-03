import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import { Suspense } from "react";
import ClipServerContainer from "@/container/clip/ClipServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.clip });

export default function Clip({ searchParams }: PageProps<"/clip">) {
  return (
    // 검색 파라미터는 요청 시점에 정해지므로, 미리 렌더링되는 화면은 "전체" 상태로 보여준다.
    <Suspense fallback={<ClipServerContainer />}>
      <ClipServerContainer searchParams={searchParams} />
    </Suspense>
  );
}
