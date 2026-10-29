import { policyContent } from "./contents/policies";
import { snsIconUrl } from "./urls";

export const companyInfo = {
  name: "Hackable",
  copyright: "© HACKABLE ALL RIGHTS RESERVED.",

  policies: [
    { label: "이용약관", href: policyContent.terms.href },
    { label: "개인정보처리방침", href: policyContent.privacy.href },
  ],

  sns: [
    {
      label: "Threads",
      href: "https://www.threads.com/@hackable_official?hl=ko",
      icon: snsIconUrl.threads,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/hackable_official/",
      icon: snsIconUrl.instagram,
    },
    {
      label: "네이버 블로그",
      href: "https://blog.naver.com/hackable_official",
      icon: snsIconUrl.naverBlog,
    },
  ],
};
