import Link from "next/link";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import NewsletterIssueView from "@/components/section/NewsletterIssueView";
import Button from "@/components/ui/Button";
import { newsletterArchiveContent } from "@/configs/contents/newsletter";
import { gaAttrs } from "@/lib/analytics";
import type { NewsletterIssueView as NewsletterIssue } from "@/utils/newsletterArchive";

// 지난 뉴스레터 한 호: 메일과 같은 카드 + 아래 구독 버튼·목록으로 돌아가기
export default function NewsletterIssueServerBlock({
  issue,
}: {
  issue: NewsletterIssue;
}) {
  const { subscribe, backToList } = newsletterArchiveContent.issue;

  return (
    <DefaultLayout>
      <HeaderSpacer />
      <div className="bg-primary-50 px-3 py-6 sm:py-10">
        <NewsletterIssueView issue={issue} />
        <div className="mx-auto mt-6 flex w-full max-w-[600px] flex-col items-center gap-3">
          <Button asChild variant="gradient" className="w-full md:h-14">
            <Link
              href={subscribe.href}
              {...gaAttrs("subscribe_cta_click", {
                location: "newsletter_issue",
              })}
            >
              {subscribe.label}
            </Link>
          </Button>
          <Link
            href={`${subscribe.href}#archive`}
            className="text-label-m font-semibold text-primary-600"
          >
            {backToList}
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
}
