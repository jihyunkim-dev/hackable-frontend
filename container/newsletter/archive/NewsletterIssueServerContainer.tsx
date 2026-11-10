import { notFound } from "next/navigation";
import { getNewsletterIssue } from "@/utils/newsletterArchive";
import NewsletterIssueClientContainer from "./NewsletterIssueClientContainer";
import NewsletterIssueServerBlock from "./NewsletterIssueServerBlock";

export default async function NewsletterIssueServerContainer({
  params,
}: {
  params: Promise<{ issue: string }>;
}) {
  const { issue } = await params;

  // 백엔드 GET /newsletter/archive/{issue}. 없는 호수는 404
  const data = await getNewsletterIssue(issue);
  if (!data) notFound();

  return (
    <NewsletterIssueClientContainer>
      <NewsletterIssueServerBlock issue={data} />
    </NewsletterIssueClientContainer>
  );
}
