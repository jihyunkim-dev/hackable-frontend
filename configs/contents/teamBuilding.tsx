import {
  defaultFilterGroups,
  defaultSortOptions,
} from "@/configs/contents/filter";

export const teamBuildingContent = {
  // value는 URL 파라미터(?type=)와 맞춘다. 전체는 파라미터 없음
  categories: [
    { value: "all", label: "전체", href: "/teambuilding" },
    { value: "project", label: "프로젝트", href: "/teambuilding?type=project" },
    { value: "study", label: "스터디", href: "/teambuilding?type=study" },
  ],
  searchPlaceholder: "어떤 팀원을 찾고 있나요?",
  create: { label: "모집글 작성", href: "/teambuilding/create" },

  // 지원사업과 같은 필터 구성 (기술스택은 맞출 데이터가 없어 뺐다)
  filterGroups: defaultFilterGroups,
  sortOptions: defaultSortOptions,

  card: {
    remainingSuffix: "남았어요",
    viewsLabel: "조회수",
    bookmarksLabel: "북마크",
  },

  detail: {
    backLabel: "팀빌딩 목록으로",
    positionLabel: "모집 포지션",
    modeLabel: "진행 방식",
    deadlineLabel: "마감일",
    bookmarkLabel: "북마크",
    shareLabel: "공유",
    copiedLabel: "복사됨",
    editLabel: "수정",
    delete: {
      button: "삭제",
      title: "모집글을 삭제할까요?",
      description: ["삭제한 모집글은 복구할 수 없어요."],
      cancel: "취소",
      submit: "삭제",
      close: "닫기",
      error: "모집글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.",
    },
  },

  form: {
    notice: {
      title: "모집글 작성 전 확인해주세요",
      paragraphs: [
        "프로젝트 소개·모집 포지션·진행 방식·기간을 구체적으로 적을수록 팀원이 잘 모여요.\n오픈카톡은 입장 승인제로 설정하면 스팸을 줄일 수 있어요.",
        "팀빌딩 목적 외 홍보·상담 유도·투자·부업 권유는 금지이며, 적발 시 게시글 삭제·이용 정지·법적 조치가 진행될 수 있어요.\n외부 채널 문제는 해커블이 책임지지 않으니 의심되면 신고해주세요.",
      ],
    },
    categoryLabel: "카테고리",
    titlePlaceholder: "제목을 입력해주세요.(100자 이내)",
    // 백엔드 TeambuildingCreate.title 최대 길이와 같다.
    titleMaxLength: 100,
    // 백엔드 TeambuildingCreate.description 최대 길이와 같다.
    bodyMaxLength: 5000,
    bodyPlaceholder:
      "팀빌딩과 관련된 모집 내용을 서술해주세요.\n[팀빌딩 모집 예시]\n• 팀빌딩 프로젝트 설명\n• 팀빌딩 프로젝트 목표\n• 필요한 기술스택\n• 지원하는 방법, 수단",
    image: {
      label: "이미지 첨부",
      description: "이미지 첨부는 하나의 이미지만 가능합니다.",
      remove: "이미지 삭제",
      invalidType: "JPG, PNG, WEBP, GIF 이미지만 첨부할 수 있어요.",
      tooLarge: "10MB 이하 이미지만 첨부할 수 있어요. (GIF는 3MB 이하)",
      uploadError: "이미지를 올리지 못했어요. 잠시 후 다시 시도해주세요.",
    },
    statusLabel: "모집 상태",
    positionLabel: "모집 포지션",
    positionHint: "필요한 포지션을 모두 골라주세요. (여러 개 선택 가능)",
    modeLabel: "진행 방식",
    modeHint: "온라인·오프라인을 같이 하면 둘 다 골라주세요.",
    deadlineLabel: "마감일",
    deadlinePlaceholder:
      "팀빌딩 마감일을 선택해주세요. 비워두면 상시 모집으로 표시돼요.",
    titleRequired: "제목을 입력해주세요.",
    // 다른 사람이 쓴 글의 수정 화면에 들어왔을 때
    notAuthor: {
      title: "수정할 수 없는 글이에요",
      description: ["내가 작성한 모집글만 수정할 수 있어요."],
      back: "글로 돌아가기",
    },
    loginRequired: ["로그인하면 팀빌딩 모집글을", "작성할 수 있어요."],
    saveError: "모집글을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
    cancel: "취소",
    submit: "등록",
    save: "수정",
  },
};
