import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import PolicyServerContainer from "@/container/policy/PolicyServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.terms });

export default function Terms() {
  return (
    <>
      <PolicyServerContainer kind="terms" />
    </>
  );
}
