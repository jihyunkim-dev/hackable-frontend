import type { FilterGroup } from "@/configs/contents/filter";

export const teamBuildingContent = {
  // value는 URL 파라미터(?type=)와 맞춘다. 전체는 파라미터 없음
  categories: [
    { value: "all", label: "전체", href: "/teambuilding" },
    { value: "project", label: "프로젝트", href: "/teambuilding?type=project" },
    { value: "study", label: "스터디", href: "/teambuilding?type=study" },
  ],
  searchPlaceholder: "어떤 팀원을 찾고 있나요?",
  create: { label: "모집글 작성", href: "/teambuilding/create" },

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
    // TODO: 기술스택 옵션 확정 필요 (피그마에 버튼만 있음)
    {
      id: "techStack",
      label: "기술스택",
      options: ["React", "Next.js", "Spring", "Node.js", "Figma", "AWS"],
    },
    { id: "status", label: "모집 상태", options: ["모집중", "모집마감"] },
  ] satisfies FilterGroup[],
  sortOptions: ["최신순", "마감임박순"],

  card: {
    remainingSuffix: "남았어요",
    viewsLabel: "조회수",
    bookmarksLabel: "북마크",
  },

  detail: {
    backLabel: "팀빌딩 목록으로",
    positionLabel: "모집 포지션",
    deadlineLabel: "마감일",
    bookmarkLabel: "북마크",
    shareLabel: "공유",
    copiedLabel: "복사됨",
  },

  form: {
    notice: {
      title: "모집글 작성 전 확인해주세요",
      paragraphs: [
        "프로젝트 소개·모집 포지션·진행 방식·기간을 구체적으로 적을수록 팀원이 잘 모여요.\n오픈카톡은 입장 승인제로 설정하면 스팸을 줄일 수 있어요.",
        "팀빌딩 목적 외 홍보·상담 유도·투자·부업 권유는 금지이며, 적발 시 게시글 삭제·이용 정지·법적 조치가 진행될 수 있어요.\n외부 채널 문제는 해커블이 책임지지 않으니 의심되면 신고해주세요.",
      ],
    },
    titlePlaceholder: "제목을 입력해주세요.(150자 이내)",
    titleMaxLength: 150,
    bodyPlaceholder:
      "팀빌딩과 관련된 모집 내용을 서술해주세요.\n[팀빌딩 모집 예시]\n• 팀빌딩 프로젝트 설명\n• 팀빌딩 프로젝트 목표\n• 필요한 기술스택\n• 지원하는 방법, 수단",
    image: {
      label: "이미지 첨부",
      description: "이미지 첨부는 하나의 이미지만 가능합니다.",
      remove: "이미지 삭제",
    },
    statusLabel: "모집 상태",
    positionLabel: "모집 포지션",
    positionPlaceholder: "팀빌딩에 필요한 모집 포지션과 인원 수를 작성해주세요.",
    deadlineLabel: "마감일",
    deadlinePlaceholder: "팀빌딩의 마감 기한을 작성해주세요.",
    cancel: "취소",
    submit: "등록",
    save: "수정",
  },
};
