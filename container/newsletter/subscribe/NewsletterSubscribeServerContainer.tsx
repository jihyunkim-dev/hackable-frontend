import NewsletterSubscribeClientContainer from "./NewsletterSubscribeClientContainer";
import NewsletterSubscribeServerBlock from "./NewsletterSubscribeServerBlock";

export default function NewsletterSubscribeServerContainer() {
  return (
    <NewsletterSubscribeClientContainer>
      <NewsletterSubscribeServerBlock />
    </NewsletterSubscribeClientContainer>
  );
}
