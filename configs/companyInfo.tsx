import { snsIconUrl } from "./urls";

export const companyInfo = {
  name: "Hackable",
  copyright: "© HACKABLE ALL RIGHTS RESERVED.",

  policies: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
  ],

  // TODO: 실제 SNS 주소로 교체
  sns: [
    { label: "Threads", href: "#", icon: snsIconUrl.threads },
    { label: "Instagram", href: "#", icon: snsIconUrl.instagram },
    { label: "네이버 블로그", href: "#", icon: snsIconUrl.naverBlog },
  ],
};
