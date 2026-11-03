import type { Metadata } from "next";
import { seoContent } from "@/configs/contents/seo";
import { pageMetadata } from "@/utils/metadata";
import NewsletterSubscribeServerContainer from "@/container/newsletter/subscribe/NewsletterSubscribeServerContainer";

export const metadata: Metadata = pageMetadata({ ...seoContent.subscribe });

export default function NewsletterSubscribe() {
  return (
    <>
      <NewsletterSubscribeServerContainer />
    </>
  );
}
