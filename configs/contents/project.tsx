import type { FilterGroup } from "@/configs/contents/filter";
import type { ProjectCategoryValue } from "@/utils/requestToSrv";

export type ProjectCategory = "all" | "hackathon" | "contest" | "startup";

export const projectContent = {
  categories: [
    {
      value: "all",
      label: "전체",
      href: "/project",
      description: "나에게 맞는 도전, 해커블에서 발견해보세요",
    },
    {
      value: "hackathon",
      label: "해커톤",
      href: "/project/ai-hackathon",
      description: "내 실력을 보여줄 해커톤, 해커블에서 시작해요",
    },
    {
      value: "contest",
      label: "AI공모전",
      href: "/project/ai-contest",
      description: "어떤 공모전으로 내 아이디어를 남겨볼까요?",
    },
    {
      value: "startup",
      label: "창업경진대회",
      href: "/project/startup-competition",
      description: "성장을 위한 다음 선택을 찾아보세요",
    },
  ] satisfies {
    value: ProjectCategory;
    label: string;
    href: string;
    description: string;
  }[],

  searchPlaceholder: "이번에는 어떤 도전을 해볼까요?",

  // 지원사업(/startup-support)은 헤더 메뉴 전용 목록이라 카테고리와 별도로 둔다.
  startupSupport: {
    title: "지원사업",
    href: "/startup-support",
    description: "성장을 위한 다음 선택을 찾아보세요",
    searchPlaceholder: "어떤 지원사업을 찾고 있나요?",
  },

  filterGroups: [
    {
      id: "position",
      label: "포지션",
      options: [
        "기획",
        "마케팅",
        "디자이너",
        "백엔드 개발자",
        "프론트엔드 개발자",
        "AI 엔지니어",
      ],
    },
    { id: "period", label: "기간", options: ["단기(1~3달)", "중장기(3~6달)"] },
    { id: "mode", label: "진행 방식", options: ["온라인", "오프라인"] },
    // TODO: 피그마에 모집 상태 옵션이 온라인/오프라인으로 들어가 있어 임시 값 사용
    { id: "status", label: "모집 상태", options: ["모집중", "모집마감"] },
  ] satisfies FilterGroup[],

  // TODO: 정렬 옵션 확정 필요 (피그마에는 최신순만 있음)
  sortOptions: ["최신순", "마감임박순"],
};

// API 카테고리 → 상세 페이지 경로
// TODO: 카테고리 묶음 확정 필요 (API 9종 → 화면 3종)
const HACKATHON_PATH = "/project/ai-hackathon";
const CONTEST_PATH = "/project/ai-contest";

export const projectDetailPath: Record<ProjectCategoryValue, string> = {
  hackathon: HACKATHON_PATH,
  ai_challenge: HACKATHON_PATH,
  ai_competition: HACKATHON_PATH,
  competition: HACKATHON_PATH,
  ai_contest: CONTEST_PATH,
  ai_image: CONTEST_PATH,
  ai_video: CONTEST_PATH,
  idea_competition: CONTEST_PATH,
  startup_competition: "/project/startup-competition",
};
