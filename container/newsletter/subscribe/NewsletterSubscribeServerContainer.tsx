import { getNewsletterArchive } from "@/utils/newsletterArchive";
import NewsletterSubscribeClientContainer from "./NewsletterSubscribeClientContainer";
import NewsletterSubscribeServerBlock from "./NewsletterSubscribeServerBlock";

export default async function NewsletterSubscribeServerContainer() {
  // 지난 뉴스레터 목록 (백엔드 GET /newsletter/archive, utils/newsletterArchive)
  const archive = await getNewsletterArchive();

  return (
    <NewsletterSubscribeClientContainer>
      <NewsletterSubscribeServerBlock archive={archive} />
    </NewsletterSubscribeClientContainer>
  );
}
