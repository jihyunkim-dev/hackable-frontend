export const signInContent = {
  title: ["성장하는 사람들을 위한", "기회의 허브, 해커블"],
  description: [
    "프로젝트부터 실전 협업까지",
    "경험을 결과로 만드는 팀빌딩 플랫폼",
  ],
  divider: "간편 로그인",
  google: "구글로 시작하기",
  kakao: "카카오로 시작하기",
  close: "로그인 닫기",
  // 로그인 = 약관 동의 (이용약관 제4조). 문구 원문: 해커블 이용약관 및 개인정보 처리방침.md > 로그인 모달 안내 문구
  agreement: {
    prefix: "로그인하면 해커블",
    terms: "이용약관",
    and: "과",
    privacy: "개인정보 처리방침",
    suffix: "에 동의하고",
    // 다음 줄
    ageConfirm: "만 14세 이상임을 확인한 것으로 봅니다.",
  },
  // 로그인이 필요한 화면 (components/section/LoginGate)
  required: {
    title: "로그인이 필요해요",
    button: "로그인",
  },
};
