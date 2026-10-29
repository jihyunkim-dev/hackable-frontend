export const newsletterSectionContent = {
  eyebrow: "해커블 뉴스레터",
  title: ["매주 화요일,", "당신이 도전할 판을 모아 보내드려요"],
  items: [
    "이번 주 마감되는 해커톤∙AI 공모전",
    "떨어져 본 사람의 실패 플레이북",
    "예비창업 지원사업과 팀원 모집",
  ],
  description: "무료로 매주 한 통 받아보세요.",
  note: "언제든 해지 가능합니다.",
  link: { label: "자세히 보기", href: "/newsletter/subscribe" },
};

export const newsletterSubscribeContent = {
  description: [
    "스펙이 아닌, 기회를 쌓는 사람들을 위해.",
    "공모전부터 해커톤, 사이드 모집까지, 해커블이 매주 모아드려요.",
  ],
  emailLabel: "이메일",
  emailPlaceholder: "이메일을 입력해주세요.",
  consentLabel: "개인정보 수집∙이용 동의",
  requiredLabel: "(필수)",
  // 동의 문구 모달 (원문: 해커블 이용약관 및 개인정보 처리방침.md > 뉴스레터 구독 폼 동의문)
  consent: {
    title: "[필수] 개인정보 수집 및 이용 동의 (만 14세 이상)",
    intro:
      "해커블 뉴스레터 발송을 위해 아래와 같이 개인정보를 수집·이용합니다. 뉴스레터는 만 14세 이상만 구독할 수 있습니다.",
    items: [
      { label: "수집 항목", value: "이메일 주소" },
      {
        label: "수집 및 이용 목적",
        value: "해커톤·공모전·지원사업 정보 등 해커블 뉴스레터 발송, 구독 관리",
      },
      {
        label: "보유 및 이용 기간",
        value: "구독 해지 시까지(해지 시 지체 없이 파기)",
      },
    ],
    notice:
      "동의를 거부할 권리가 있으나, 거부하면 뉴스레터를 받아볼 수 없습니다.",
    policyLink: { label: "개인정보 처리방침 전문 보기", href: "/privacy" },
    agree: "동의하기",
    close: "닫기",
  },
  submit: "구독하기",
  submitting: "구독 신청 중...",
  error: "구독 신청에 실패했어요. 잠시 후 다시 시도해주세요.",
  success: {
    notice: [
      "입력하신 주소로 확인 메일을 드렸어요.",
      "메일함에서 확인해주세요.",
    ],
  },
};
