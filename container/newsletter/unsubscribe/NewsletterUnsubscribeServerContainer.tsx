import { Suspense } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import { NewsletterUnsubscribeForm } from "./NewsletterUnsubscribeClientBlock";

export default function NewsletterUnsubscribeServerContainer() {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <section className="flex min-h-[400px] flex-col items-center justify-center bg-white p-2.5 lg:min-h-[450px]">
        {/* 토큰을 주소(?token=)에서 읽어 요청마다 달라지므로 Suspense로 감싼다. */}
        <Suspense>
          <NewsletterUnsubscribeForm />
        </Suspense>
      </section>
    </DefaultLayout>
  );
}
