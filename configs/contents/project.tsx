import {
  defaultFilterGroups,
  defaultSortOptions,
} from "@/configs/contents/filter";
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

  filterGroups: defaultFilterGroups,

  sortOptions: defaultSortOptions,
};

// 화면 카테고리별로 API에 보낼 세분류 묶음 (백엔드 /project category 설명 기준)
export const projectApiCategories: Record<
  Exclude<ProjectCategory, "all">,
  ProjectCategoryValue[]
> = {
  hackathon: ["hackathon", "ai_competition", "ai_challenge"],
  contest: ["ai_video", "ai_image", "ai_contest"],
  startup: [
    "startup_competition",
    "idea_competition",
    "space_competition",
    "competition",
  ],
};

// API 세분류 → 상세 페이지 경로. 위 묶음에서 만든다. (묶음에 없는 값은 해커톤 경로로 보낸다)
export const projectDetailPath: Partial<Record<ProjectCategoryValue, string>> =
  Object.fromEntries(
    projectContent.categories.flatMap((category) =>
      category.value === "all"
        ? []
        : projectApiCategories[category.value].map((value) => [
            value,
            category.href,
          ]),
    ),
  );
