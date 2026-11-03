import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import MainServerContainer from "@/container/main/MainServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.home });

export default function Main() {
  return (
    <>
      <MainServerContainer />
    </>
  );
}
