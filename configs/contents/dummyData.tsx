// TODO: API 연동 후 제거. 메인 페이지 확인용 더미 데이터
import type { ClipDetail } from "@/components/section/ClipDetailSection";
import type { FeaturedClip } from "@/components/section/ClipFeaturedCarousel";
import type { ClipItem } from "@/components/section/ClipCard";
import type { RecommendClipItem } from "@/components/section/RecommendClipCard";
import type { WeeklyClipItem } from "@/components/section/WeeklyClipList";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
import type { TeamBuildingDetail } from "@/components/section/TeamBuildingDetailSection";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { OpportunityTabValue } from "@/configs/contents/main";
import { dummyImageUrl } from "@/configs/urls";

const detailPath: Record<OpportunityTabValue, string> = {
  hackathon: "/project/ai-hackathon",
  contest: "/project/ai-contest",
  support: "/startup-support",
};

const createProjects = (type: OpportunityTabValue): ProjectItem[] =>
  Array.from({ length: 4 }, (_, index) => {
    const id = `${type}-${index + 1}`;
    return {
      id,
      title: "2026 요기요 X 오라클 해커톤 : 맛있는 일상, AI로 잇(IT)다",
      thumbnail: dummyImageUrl.projectPoster,
      dDay: "D-10",
      prizeLabel: "시상규모",
      prize: "350만원",
      href: `${detailPath[type]}/${id}`,
    };
  });

export const dummyProjects: Record<OpportunityTabValue, ProjectItem[]> = {
  hackathon: createProjects("hackathon"),
  contest: createProjects("contest"),
  support: createProjects("support"),
};

export const createDummyClipList = (length = 4): ClipItem[] =>
  Array.from({ length }, (_, index) => ({
  id: `clip-${index + 1}`,
  category: "기획∙마케팅∙디자인",
  title: "기획자, 안티그래비티(Antigravity) 이렇게 써봤습니다",
  description:
    "요즘 실무에서 발생하는 대부분의 문제는 커뮤니케이션에서 비롯된다. 기획서가 디자인 시안으로, 개발자의 코드로 변환되는 과정에서 설득과 설명만으로는 100% 기획자의 의도를 전달하기 어렵기 때문이다. 그래서 최근 주목받고 있는 바이브코딩",
  readTime: "8분",
  createdAt: "2026.01.19",
  thumbnail: dummyImageUrl.clipThumbnail,
  href: `/clip/clip-${index + 1}`,
}));

export const dummyClips = createDummyClipList();

// 목록 페이지 더미 데이터
const posterSamples: Omit<ProjectItem, "id" | "href">[] = [
  {
    title: "2026 롯데월드 상품 디자인 공모전 - YOU & I : 함께하는 순간, 롯데월드",
    thumbnail: dummyImageUrl.posterLotte,
    dDay: "D-10",
    prizeLabel: "시상규모",
    prize: "1,000만원",
  },
  {
    title: "2026 요기요 X 오라클 해커톤 : 맛있는 일상, AI로 잇(IT)다",
    thumbnail: dummyImageUrl.projectPoster,
    dDay: "D-10",
    prizeLabel: "시상규모",
    prize: "350만원",
  },
  {
    title: "2026 사회적기업 창업지원사업 창업팀 모집 공고",
    thumbnail: dummyImageUrl.posterStartup,
    dDay: "D-10",
    prizeLabel: "지원규모",
    prize: "8,000만원",
  },
];

const listDetailPath = {
  hackathon: "/project/ai-hackathon",
  contest: "/project/ai-contest",
  startup: "/project/startup-competition",
  support: "/startup-support",
} as const;

const sampleCategory = ["contest", "hackathon", "startup"] as const;

export const createDummyProjectList = (
  category: "all" | keyof typeof listDetailPath,
  length = 12,
): ProjectItem[] =>
  Array.from({ length }, (_, index) => {
    // 지원사업은 창업 포스터 샘플을 쓴다.
    const sampleIndex =
      category === "all"
        ? index % 3
        : sampleCategory.indexOf(category === "support" ? "startup" : category);
    const type = category === "support" ? "support" : sampleCategory[sampleIndex];
    const id = `${type}-${index + 1}`;
    return { ...posterSamples[sampleIndex], id, href: `${listDetailPath[type]}/${id}` };
  });

// 상세 페이지 더미 데이터
const dummyDetailBody = `AI가 제안하는 완벽한 한 끼, 여러분의 기획으로 완성됩니다!
대한민국 배달 문화를 혁신해 온 요기요와 글로벌 테크 기업 오라클이 함께 푸드테크의 미래를 설계할 청년 인재를 모집합니다.
실무 역량 강화는 물론, 차별화된 포트폴리오를 구축할 수 있는 이번 해커톤에 여러분의 많은 관심과 참여 바랍니다.

공모 주제 : AI를 활용하여 요기요 앱 사용 경험을 향상시킬 수 있는 아이디어
[예시]
- Hyper-Personalization(초 개인화): 사용자의 주문 패턴, 날씨, 기분, 영양 상태 등을 분석하여 메뉴를 선제적으로 제안하는 AI 큐레이션 서비스
- User Experience(UX 혁신): LLM 기반의 대화형 인터페이스, 음성 주문 혹은 리뷰 분석을 통한 신뢰도 높은 정보 제공 기능
- 신규 유입 및 리텐션: Gamification이나 디지털 기술을 활용해 경쟁사 대비 요기요를 더 자주, 더 즐겁게 이용하게 만들 전략

참가 자격:
- 만 18세 이상의 개인 또는 팀(최대 4명)
- 대학(원)생, 취업준비생 등 모두 참여 가능

주요 일정
- 접수 기간: 6월 22일(월) ~ 7월 12일(일) 23:59 까지
- 본선 진출팀 발표: 7월 24일(금)
- 최종 결과물 제출: ~8월 21일(금) 18:00시 까지
- PT발표 및 시상식(오프라인): 8월 마지막주 (오라클 본사에서 진행 예정)
*상기 일정은 공모전 진행 상황에 따라 변경될 수 있습니다.

시상 내역
- 최우수상(1팀): 200만원 상당 상품
- 우수상(1팀): 100만원 상당 상품
- 장려상(1팀): 50만원 상당 상품

문의 사항: 요기요 해커톤 운영 담당자 (recruit@wesang.com)`;

export const createDummyProjectDetail = (
  type: keyof typeof listDetailPath,
  id: string,
): ProjectDetail => {
  const sample =
    posterSamples[sampleCategory.indexOf(type === "support" ? "startup" : type)];
  return {
    id,
    title: sample.title,
    host: "위대한 상상, 오라클",
    period: "2026.06.22 ~ 2026.07.12",
    dDay: sample.dDay,
    views: 127,
    thumbnail: sample.thumbnail,
    body: dummyDetailBody,
    applyUrl: "#",
  };
};

// 팀빌딩 더미 데이터
export const createDummyTeamBuildingList = (length = 8): TeamBuildingItem[] =>
  Array.from({ length }, (_, index) => ({
    id: `team-${index + 1}`,
    isOpen: true,
    category: "해커톤",
    title: "서울 거주하시는 프론트 한 분, 백엔드 두 분 팀원 구합니다🙌🏻",
    dDay: "D-21",
    author: `작성자${index + 1}`,
    views: 146,
    bookmarks: 6,
    href: `/teambuilding/team-${index + 1}`,
  }));

export const createDummyTeamBuildingDetail = (id: string): TeamBuildingDetail => ({
  id,
  isOpen: true,
  title: "[사이드프로젝트 / 프로덕트 디자이너 1명] 운동 기록 서비스 OnRep 팀원 모집",
  author: "작성자1",
  createdAt: "2026.10.08 14:38",
  views: 128,
  bookmarks: 36,
  body: `안녕하세요. 운동 기록 서비스 OnRep을 개발하고 있습니다.
서비스의 사용자 경험과 UI를 함께 개선할 프로덕트 디자이너 한 분을 모집합니다.

프로젝트 소개
운동 기록을 쌓고 자신의 변화와 성장을 확인할 수 있는 서비스를 만들고 있습니다. 실제 사용 과정의 불편을 살펴보고 개선하는 작업을 함께하려고 합니다.

참여할 작업
- 운동 시작·기록·완료 과정의 UX 개선
- 운동 기록과 변화 비교 화면 설계
- 신규 기능의 사용자 흐름 및 UI 디자인

찾는 분
러닝·크로스핏·웨이트·사이클·줄넘기 등 하나 이상의 운동을 좋아하고, 더 잘하기 위해 기록과 성장에 관심을 갖는 프로덕트 디자이너 한 분

협업 방식
주 1회, 서로 가능한 시간을 협의해 온라인 미팅을 진행할 예정입니다.

보상 방식
서비스 순이익 발생 시 운영자 60%, 참여 팀원 전체 40%를 배분하며, 팀원 몫 40%는 참여 팀원 수에 따라 균등 분배합니다.

연락 방법
아래 오픈채팅으로 간단한 자기소개와 관심 있는 운동을 보내주세요.
작업물이 있다면 함께 공유해 주세요.`,
  position: "프로덕트 디자이너 1명",
  deadline: "2026.10.20",
});

// 클립 더미 데이터
export const dummyFeaturedClips: FeaturedClip[] = Array.from({ length: 5 }, (_, index) => ({
  id: `featured-${index + 1}`,
  category: "개발",
  title: ["영리한 개발자와", "현명한 개발자의 차이점"],
  image: dummyImageUrl.clipFeatured,
  href: `/clip/clip-${index + 1}`,
}));

export const dummyWeeklyClips: WeeklyClipItem[] = Array.from({ length: 4 }, (_, index) => ({
  id: `weekly-${index + 1}`,
  title: "Claude Code 토큰 완벽 가이드 : AI 네이티브 개발의 핵심",
  category: "AI",
  readTime: "11분",
  createdAt: "2026.01.21",
  thumbnail: dummyImageUrl.clipWeekly,
  href: `/clip/clip-${index + 1}`,
}));

export const dummyWeeklyTitle = "2월 4주차 인기클립";

export const dummyRecommendClips: RecommendClipItem[] = Array.from({ length: 3 }, (_, index) => ({
  id: `recommend-${index + 1}`,
  tags: ["기획", "AI", "자동화", "바이브코딩"],
  title: "기획자, 안티그래비티(Antigravity) 이렇게 써봤습니다",
  readTime: "8분",
  createdAt: "2026.01.22",
  thumbnail: dummyImageUrl.clipThumbnail,
  href: `/clip/clip-${index + 2}`,
}));

export const createDummyClipDetail = (id: string): ClipDetail => ({
  id,
  category: "기획",
  title: "기획자, 안티그래비티(Antigravity) 이렇게 써봤습니다",
  readTime: "8분",
  createdAt: "2026.01.28",
  views: 159,
  bookmarks: 24,
  blocks: [
    {
      type: "paragraph",
      text: "요즘 실무에서 발생하는 대부분의 문제는 커뮤니케이션에서 비롯된다. 기획서가 디자인 시안으로, 개발자의 코드로 변환되는 과정에서 설득과 설명만으로는 100% 기획자의 의도를 전달하기 어렵기 때문이다.\n\n그래서 최근 주목받고 있는 바이브코딩을 직접 해보기로 했다. 기획자가 직접 동작하는 결과물을 만들어 보여줄 수 있다면, 커뮤니케이션 비용을 크게 줄일 수 있을 거라 생각했다.",
    },
    {
      type: "image",
      src: dummyImageUrl.clipBody,
      alt: "인플루언서 파인더 서비스 화면",
      width: 1462,
      height: 734,
      caption: "인플루언서 파인더 <출처: 작가>",
    },
    { type: "heading", id: "setup", text: "AI 에이전트와 협업하기 위한 기초 세팅" },
    {
      type: "paragraph",
      text: "처음 MVP는 인플루언서 검색으로 시작했다. 목표는 공동구매를 진행할 인플루언서를 빠르게 찾고, 조건에 맞는 후보를 정리하는 것이었다.\n\n1) 안티그래비티 다운로드 및 설정\n2) 실행 환경 구축(Runtime & 도구)\n3) DB 연동",
    },
    { type: "heading", id: "closing", text: "마치며: 기획의 언어는 바뀌어야 한다" },
    {
      type: "paragraph",
      text: "바이브 코딩으로 상상했던 것을 만들어보니, 생각했던 것 이상으로 많은 것을 직접 확인할 수 있었다. 이제 기획자의 언어는 문서에서 동작하는 결과물로 옮겨가고 있다.",
    },
  ],
});

// 마이페이지 더미 데이터
export const dummyMypage = {
  profile: { name: "김지현", role: "프론트엔드 개발자", image: dummyImageUrl.profile },
  bookmarkedProjects: {
    hackathon: createDummyProjectList("hackathon", 6),
    contest: createDummyProjectList("contest", 6),
    support: createDummyProjectList("support", 6),
  },
  bookmarkedTeamBuildings: createDummyTeamBuildingList(2),
  writtenTeamBuildings: Array.from({ length: 3 }, (_, index) => ({
    id: `my-team-${index + 1}`,
    category: "해커톤",
    title: "서울 거주하시는 프론트 한 분, 백엔드 두 분 팀원 구합니다🙌🏻",
    isOpen: index === 0,
    href: `/teambuilding/my-team-${index + 1}`,
  })),
  bookmarkedClips: dummyClips.slice(0, 3),
};
