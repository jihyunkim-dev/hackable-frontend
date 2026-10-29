export const clipContent = {
  searchPlaceholder: "어떤 클립을 찾고 있나요?",
  // 목록이 비었을 때 안내 문구
  empty: {
    search: (q: string) => `"${q}"에 대한 검색 결과가 없어요.`,
    category: [
      "아직 해당 주제에 작성된 클립이 없어요.",
      "조금만 기다려주세요.",
    ],
    all: "아직 등록된 클립이 없어요.",
  },
  hero: {
    title: "클립",
    description: "많은 독자들의 관심을 이끌은 클립들을 모았어요",
  },
  // value는 URL 파라미터(?category=)이자 API의 category 값이다. 전체는 파라미터 없음
  categories: [
    { value: "all", label: "전체", href: "/clip" },
    { value: "tech", label: "AI・개발", href: "/clip?category=tech" },
    {
      value: "vibeCoding",
      label: "바이브코딩",
      href: "/clip?category=vibeCoding",
    },
    { value: "pmd", label: "기획・마케팅・디자인", href: "/clip?category=pmd" },
    { value: "trend", label: "트렌드", href: "/clip?category=trend" },
  ],
  featuredLabel: "추천 클립",
  detail: {
    bookmarkLabel: "북마크",
    shareLabel: "공유",
    copiedLabel: "복사됨",
    tocLabel: "목차",
    recommendTitle: "이 콘텐츠도 흥미있으실 것 같아요",
  },
};
