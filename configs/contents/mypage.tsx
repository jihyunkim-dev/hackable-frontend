export const mypageContent = {
  profileEdit: "프로필 수정",
  logout: "로그아웃",
  guest: {
    title: "로그인이 필요해요",
    description: [
      "로그인하면 북마크한 프로젝트와",
      "내가 쓴 팀빌딩 글을 볼 수 있어요.",
    ],
    button: "로그인",
  },
  empty: "아직 없어요.",
  loadError: "내 활동을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
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
    statusError: "모집 상태를 바꾸지 못했어요. 다시 시도해주세요.",
  },
  clip: {
    bookmarkedTitle: "북마크한 클립",
  },
  withdraw: {
    title: "계정 탈퇴",
    description: [
      "계정 탈퇴 시 아래 정보가 삭제되거나",
      "이용할 수 없게 됩니다.",
    ],
    // 백엔드 탈퇴 처리(DELETE /auth/withdraw)와 맞춘다.
    items: [
      "탈퇴하면 바로 로그인할 수 없어요.",
      "북마크한 프로젝트·지원사업·팀빌딩·클립은 삭제돼요.",
      "작성한 팀빌딩 모집글은 더 이상 보이지 않아요.",
      "계정 정보는 6개월 보관 후 완전히 삭제되며, 그 전까지는 같은 계정으로 다시 가입할 수 없어요.",
      "탈퇴 후 기존 활동 내역은 복구할 수 없어요.",
    ],
    button: "탈퇴하기",
    confirm: {
      title: "정말 탈퇴하시겠어요?",
      description: ["탈퇴 후 계정과 활동 내역은", "복구할 수 없습니다."],
      cancel: "취소",
      submit: "탈퇴하기",
      close: "닫기",
      error: "탈퇴하지 못했어요. 다시 시도해주세요.",
    },
  },
};
