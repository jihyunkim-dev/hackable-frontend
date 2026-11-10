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
  // <strong>은 강조 글자 (굵게·보라색)
  description: [
    <>
      기회를 쌓는 사람들을 위해 <strong>무료</strong>로
    </>,
    "해커블이 공모전부터 해커톤, 사이드 모집까지.",
    "매주 정성스럽게 모아드려요.",
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
    notice: ["구독이 완료되었어요."],
  },
};

// 메일의 수신 거부 링크로 들어오는 페이지 (/newsletter/unsubscribe?token=)
export const newsletterUnsubscribeContent = {
  title: "해커블 뉴스레터 수신을 거부할까요?",
  submit: "수신 거부",
  submitting: "처리 중...",
  done: "수신 거부가 완료되었어요.",
  invalid: "유효하지 않은 링크예요.",
  error: "수신 거부에 실패했어요. 잠시 후 다시 시도해주세요.",
};

// 지난 뉴스레터: 구독 페이지 아래 목록과 호수별 상세 (/newsletter/archive/{호수})
// 상세 문구는 발송 메일과 같다.
export const newsletterArchiveContent = {
  eyebrow: "해커블 뉴스레터",
  title: "지난 뉴스레터 미리 보기",
  listLabel: "지난 뉴스레터 목록",
  empty: "아직 발행된 뉴스레터가 없어요.",
  issue: {
    weekly: (number: string, date: string) => `WEEKLY #${number} · ${date}`,
    headline: (thisWeek: number) => ["이번 주에만", `${thisWeek}개가 닫혀요`],
    summary: (total: number) =>
      `해커톤·AI 대회·창업 지원사업 ${total}개를 마감 순으로 모았어요.`,
    partLabel: (index: number) => `PART ${index + 1}`,
    listedSuffix: (count: number) => ` · 마감 가까운 순 ${count}개`,
    pickLabel: {
      prize: "★ PICK · 이 파트 최고 상금",
      deadline: "★ PICK · 이 파트에서 가장 먼저 마감",
    },
    prizeLabel: "상금",
    prizeUnit: "만원",
    deadlineLabel: "마감까지",
    deadlineSuffix: "마감",
    pickLink: "공고 보러가기",
    more: "해커블에서 전체 보기 →",
    notice:
      "마감일과 내용은 각 공고 원문 기준이며 변경될 수 있어요. 지원 전에 원문을 꼭 확인해 주세요.",
    schedule: "해커블 · 매주 화요일 오전 8시",
    subscribe: { label: "무료로 구독하기", href: "/newsletter/subscribe" },
    backToList: "지난 뉴스레터 목록",
  },
};
