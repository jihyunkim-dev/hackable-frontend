export const clipContent = {
  searchPlaceholder: "어떤 클립을 찾고 있나요?",
  hero: {
    title: "클립",
    description: "많은 독자들의 관심을 이끌은 클립들을 모았어요",
  },
  // value는 URL 파라미터(?category=)와 맞춘다. 전체는 파라미터 없음
  categories: [
    { value: "all", label: "전체", href: "/clip" },
    { value: "ai", label: "AI개발", href: "/clip?category=ai" },
    { value: "vibe-coding", label: "바이브코딩", href: "/clip?category=vibe-coding" },
    { value: "planning", label: "기획∙마케팅∙디자인", href: "/clip?category=planning" },
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
