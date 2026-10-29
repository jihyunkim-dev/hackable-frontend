import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import { policyEffectiveDate } from "@/configs/contents/policies";
import { MARKDOWN_STYLE } from "@/lib/markdownStyle";
import { cn } from "@/lib/utils";

// 약관 본문: 조항 안의 "가. 나. ..." 하위 목록은 글머리 기호 없이 보여준다.
const POLICY_STYLE = cn(
  MARKDOWN_STYLE,
  "text-gray-700 [&_ol_ul]:list-none [&_ol_ul]:pl-1 [&_table]:min-w-[480px]",
);

export default function PolicyServerBlock({
  title,
  html,
}: {
  title: string;
  html: string;
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <article className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 py-10 sm:px-8 lg:gap-10 lg:py-16">
        <header className="flex flex-col gap-2 border-b border-gray-200 pb-6">
          <h1 className="text-heading-s font-bold text-gray-900 lg:text-heading-m">
            {title}
          </h1>
          <p className="text-body-s text-gray-500">{policyEffectiveDate}</p>
        </header>
        {/* 표가 화면보다 넓으면 본문 안에서 가로 스크롤 */}
        <div
          className={cn(POLICY_STYLE, "overflow-x-auto")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </DefaultLayout>
  );
}
