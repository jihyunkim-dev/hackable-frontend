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
    // 아래 3종은 문구_링크_정리.md(v2) 기준. 본문은 문장 단위로 줄을 나눈다.
    {
      id: "teambuilding",
      category: "팀빌딩",
      title: "해커톤 팀원, 여기서 구해요",
      description: {
        mobile: [
          "대회는 찾았는데 팀이 안 꾸려져서 접은 적 있죠.",
          "포지션과 기술스택으로 나와 맞는 팀을 찾거나, 모집글을 올려 빈자리를 채워보세요.",
        ],
        desktop: [
          "대회는 찾았는데 팀이 안 꾸려져서 접은 적 있죠.",
          "포지션과 기술스택으로 나와 맞는 팀을 찾거나,",
          "모집글을 올려 빈자리를 채워보세요.",
        ],
      },
      buttonLabel: "팀원 찾으러 가기",
      href: "/teambuilding",
      image: mainImageUrl.carouselTeamBuilding,
      imageAlt:
        "남은 자리, 딱 한 명. 프론트엔드 한 명만 더 있으면 이번 해커톤 나갈 수 있어요.",
    },
    {
      id: "startup-support",
      category: "지원사업",
      title: "창업 지원사업, 한곳에서 확인",
      description: {
        mobile: [
          "정부, 지자체, 대학 창업지원단 공고는 올라오는 곳이 다 달라요.",
          "해커블이 한곳에 모아뒀으니 마감 전에 내게 맞는 사업을 골라보세요.",
        ],
        desktop: [
          "정부, 지자체, 대학 창업지원단 공고는 올라오는 곳이 다 달라요.",
          "해커블이 한곳에 모아뒀으니",
          "마감 전에 내게 맞는 사업을 골라보세요.",
        ],
      },
      buttonLabel: "지원사업 둘러보기",
      href: "/startup-support",
      image: mainImageUrl.carouselStartupSupport,
      imageAlt:
        "마감 하루 전에 알게 된 공고, 이번엔 없게. 흩어진 창업 지원사업, 해커블에서 먼저 확인하세요.",
    },
    {
      id: "clip",
      category: "클립",
      title: "이번 주 많이 읽은 클립",
      description: {
        mobile: [
          "AI 툴은 매주 새로 나오는데 다 써볼 시간은 없죠.",
          "직접 써본 사람들이 정리한 AI개발, 바이브코딩, 기획 이야기를 출퇴근길에 읽어보세요.",
        ],
        desktop: [
          "AI 툴은 매주 새로 나오는데 다 써볼 시간은 없죠.",
          "직접 써본 사람들이 정리한 AI개발, 바이브코딩, 기획 이야기를",
          "출퇴근길에 읽어보세요.",
        ],
      },
      buttonLabel: "클립 읽으러 가기",
      href: "/clip",
      image: mainImageUrl.carouselClip,
      imageAlt: "다 써보고 정리했어요. 해커블 클립 이번 주 인기 클립.",
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
