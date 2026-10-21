import type { Metadata } from "next";
import NewsletterSubscribeServerContainer from "@/container/newsletter/subscribe/NewsletterSubscribeServerContainer";

export const metadata: Metadata = {
  title: {
    absolute: "뉴스레터 구독 | hackable",
  },
  description: "",
  alternates: {
    canonical: "/newsletter/subscribe",
  },
};

export default function NewsletterSubscribe() {
  return (
    <>
      <NewsletterSubscribeServerContainer />
    </>
  );
}
