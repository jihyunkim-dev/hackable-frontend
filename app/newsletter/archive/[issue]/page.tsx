import type { Metadata } from "next";
import { detailTitle, pageMetadata } from "@/utils/metadata";
import NewsletterIssueServerContainer from "@/container/newsletter/archive/NewsletterIssueServerContainer";
import {
  getNewsletterIssue,
  getNewsletterIssueHref,
  getNewsletterIssueStaticParams,
} from "@/utils/newsletterArchive";

// 지난 호수는 바뀌지 않아 빌드 때 완성된 페이지로 만든다. 새 호수는 첫 방문 때 만들어 저장한다.
export const generateStaticParams = getNewsletterIssueStaticParams;

export async function generateMetadata({
  params,
}: PageProps<"/newsletter/archive/[issue]">): Promise<Metadata> {
  const { issue } = await params;
  const data = await getNewsletterIssue(issue);

  return pageMetadata({
    title: detailTitle(data?.title ?? "해커블 뉴스레터"),
    description: data
      ? `이번 주 마감 ${data.thisWeek}개, 해커톤·AI 공모전·예비창업 지원사업 ${data.total}개를 마감 순으로 모은 해커블 뉴스레터예요.`
      : "",
    path: getNewsletterIssueHref(issue),
  });
}

export default function NewsletterIssue({
  params,
}: PageProps<"/newsletter/archive/[issue]">) {
  return <NewsletterIssueServerContainer params={params} />;
}
