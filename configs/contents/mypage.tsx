export const mypageContent = {
  profileEdit: "프로필 수정",
  logout: "로그아웃",
  activityTitle: "내 활동",
  settingsTitle: "계정 설정",
  settingsLabel: "계정 설정 열기",
  backToActivity: "내 활동",
  tabs: [
    { value: "project", label: "프로젝트" },
    { value: "teamBuilding", label: "팀빌딩" },
    { value: "clip", label: "클립" },
  ],
  project: {
    bookmarkedTitle: "북마크한 프로젝트",
    filters: [
      { value: "hackathon", label: "해커톤" },
      { value: "contest", label: "공모전" },
      { value: "support", label: "지원사업" },
    ],
  },
  teamBuilding: {
    bookmarkedTitle: "북마크한 팀빌딩",
    writtenTitle: "내가 작성한 팀빌딩",
    statusLabel: "모집 상태",
  },
  clip: {
    bookmarkedTitle: "북마크한 클립",
  },
  withdraw: {
    title: "계정 탈퇴",
    description: ["계정 탈퇴 시 아래 정보가 삭제되거나", "이용할 수 없게 됩니다."],
    items: [
      "프로필 정보",
      "좋아요한 프로젝트/클립",
      "작성한 팀빌딩 글 처리 방식은 운영 정책에 따라 관리됩니다.",
      "탈퇴 후 기존 활동 내역은 복구할 수 없습니다.",
    ],
    button: "탈퇴하기",
    confirm: {
      title: "정말 탈퇴하시겠어요?",
      description: ["탈퇴 후 계정과 활동 내역은", "복구할 수 없습니다."],
      cancel: "취소",
      submit: "탈퇴하기",
      close: "닫기",
    },
  },
};
