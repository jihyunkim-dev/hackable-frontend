import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import PromoBanner from "@/components/section/PromoBanner";
import { bannerContent } from "@/configs/contents/banners";
import { NewsletterSubscribeForm } from "./NewsletterSubscribeClientBlock";

export default function NewsletterSubscribeServerBlock() {
  // 이 페이지 자체가 구독 페이지라 배너는 링크 없이 보여준다.
  const { images, alt } = bannerContent.subscribe;

  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner images={images} alt={alt} priority />
      <SubscribeSection />
    </DefaultLayout>
  );
}

function SubscribeSection() {
  return (
    <section className="flex min-h-[400px] flex-col items-center justify-center bg-background-alternative p-2.5 lg:min-h-[450px]">
      <NewsletterSubscribeForm />
    </section>
  );
}
