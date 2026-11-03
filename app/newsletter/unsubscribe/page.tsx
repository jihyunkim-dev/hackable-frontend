import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import NewsletterUnsubscribeServerContainer from "@/container/newsletter/unsubscribe/NewsletterUnsubscribeServerContainer";

// 토큰이 담긴 주소라 검색에 내보내지 않고, 다른 사이트로 주소를 넘기지 않는다.
export const metadata: Metadata = {
  ...pageMetadata({ ...seoContent.unsubscribe, noindex: true }),
  referrer: "no-referrer",
};

export default function NewsletterUnsubscribe() {
  return <NewsletterUnsubscribeServerContainer />;
}
