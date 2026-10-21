import { mainImageUrl } from "@/configs/urls";

export type OpportunityTabValue = "hackathon" | "contest" | "support";

export interface MainCarouselSlide {
  id: string;
  category: string;
  title: string;
  description: { mobile: string[]; desktop: string[] };
  buttonLabel: string;
  href: string;
  image: string;
  imageAlt: string;
}

export const mainContent = {
  hero: {
    title: ["성장하는 사람들을 위한", "기회의 허브, 해커블"],
    description: "해커톤, 공모전, 지원사업. 그리고 함께할 팀까지",
  },

  carousel: [
    {
      id: "newsletter",
      category: "구독",
      title: "해커블 뉴스레터 구독 서비스",
      // 피그마 줄바꿈 기준. mobile: xs·sm, desktop: md 이상
      description: {
        mobile: [
          "좋은 기회는 생각보다 많지만, 제때 발견하기는",
          "쉽지 않아요. 당신이 도전에 집중할 수 있도록,",
          "해커블이 매주 엄선한 해커톤, 공모전, 지원사업 소식을 찾아드릴게요.",
        ],
        desktop: [
          "좋은 기회는 생각보다 많지만, 제때 발견하기는 쉽지 않아요.",
          "당신이 도전에 집중할 수 있도록, 해커블이 매주 엄선한",
          "해커톤, 공모전, 지원사업 소식을 찾아드릴게요.",
        ],
      },
      buttonLabel: "보러가기",
      href: "/newsletter/subscribe",
      image: mainImageUrl.carouselNewsletter,
      imageAlt:
        "기회를 찾는 시간보다 도전하는 시간에 집중할 수 있도록. 해커톤, 공모전, 지원사업까지 해커블이 도와드려요.",
    },
  ] satisfies MainCarouselSlide[],

  opportunity: {
    eyebrow: "해커톤·공모전·지원사업",
    title: ["흩어진 기회들을 찾느라", "시간 낭비는 그만"],
    tabs: [
      {
        value: "hackathon",
        label: "해커톤",
        moreLabel: "해커톤 더 보기",
        moreHref: "/project/ai-hackathon",
      },
      {
        value: "contest",
        label: "공모전",
        moreLabel: "공모전 더 보기",
        moreHref: "/project/ai-contest",
      },
      {
        value: "support",
        label: "지원사업",
        moreLabel: "지원사업 더 보기",
        moreHref: "/startup-support",
      },
    ] satisfies {
      value: OpportunityTabValue;
      label: string;
      moreLabel: string;
      moreHref: string;
    }[],
  },

  clip: {
    eyebrow: "해커블 클립",
    title: ["성장에 필요한 실전 인사이트를", "해커블에서 만나보세요"],
  },

  closing: {
    title: ["당신의 가능성을", "하나로 정의하지 마세요"],
    description: "지금 해커블에서 더 넓은 기회와 도전을 만나보세요.",
    buttonLabel: "기회 탐색하러 가기",
    href: "/project",
  },
};
