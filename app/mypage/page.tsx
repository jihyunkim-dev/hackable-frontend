import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import MypageServerContainer from "@/container/mypage/MypageServerContainer";

export const metadata: Metadata = pageMetadata({
  ...seoContent.mypage,
  noindex: true,
});

export default function Mypage() {
  return (
    <>
      <MypageServerContainer />
    </>
  );
}
