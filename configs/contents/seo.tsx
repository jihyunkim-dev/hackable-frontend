// 페이지별 검색·공유용 제목과 설명. (정보구조·URL·메타 v3.4, 2026.10.29 기준)
// 상세 페이지 제목은 항상 "{원문 이름} | 해커블". 설명 틀은 utils/metadata 참고.

export const siteName = "해커블";

export const seoContent = {
  home: {
    path: "/",
    title: "해커블 | 누구나 도전하는 해커톤 플랫폼",
    description:
      "누구나 도전하는 해커톤 플랫폼, 해커블. 해커톤대회부터 AI공모전·창업경진대회, 팀빌딩, 창업 지원사업까지 한 사이트에서. 대학생·이직 준비생·예비창업가 누구나 시작할 수 있어요.",
  },
  project: {
    path: "/project",
    title: "해커톤대회 · 경진대회 · 공모전 일정 | 해커블",
    description:
      "해커톤대회부터 AI공모전, 창업경진대회까지 지금 접수 중인 경진대회·공모전 일정을 마감일순으로 모았어요. 대학생이 대외활동으로 도전할 수 있는 대회를 확인하세요.",
  },
  aiHackathon: {
    path: "/project/ai-hackathon",
    title: "AI해커톤 · AI경진대회 · AI챌린지 모음 | 해커블",
    description:
      "지금 모집 중인 AI해커톤과 AI경진대회를 한곳에. 바이브코딩으로 비개발자도 나갈 수 있는 대회부터 일정·상금·참가 자격까지 비교하고, 함께할 팀원도 찾아보세요.",
  },
  aiContest: {
    path: "/project/ai-contest",
    title: "AI공모전 사이트 · AI영상공모전 모음 | 해커블",
    description:
      "AI 영상·숏폼부터 광고·CF·브랜드 콘텐츠, AI 영화 공모전까지 지금 접수 중인 AI공모전을 마감일순으로 모았어요. 상금·참가 자격·마감일을 한눈에 비교하세요.",
  },
  startupCompetition: {
    path: "/project/startup-competition",
    title: "창업경진대회 · 아이디어공모전 · 창업공모전 | 해커블",
    description:
      "창업경진대회와 창업 아이디어 공모전을 한곳에. AI 창업부터 대학생 창업 아이디어 경진대회까지 지금 모집 중인 대회의 상금·자격·일정을 확인하세요.",
  },
  startupSupport: {
    path: "/startup-support",
    title: "청년창업지원금 · 예비창업자 지원사업 · 창업지원센터 | 해커블",
    description:
      "대학생·예비창업가를 위한 창업지원사업을 한곳에. 청년창업지원금 현황부터 예비창업자 지원사업, 창업지원센터·창업보육센터·캠퍼스타운 입주기업 모집 공고까지 한눈에 확인하세요.",
  },
  teamBuilding: {
    path: "/teambuilding",
    title: "팀빌딩 · 사이드프로젝트 · 스터디모임 | 해커블",
    description:
      "해커톤·공모전 팀빌딩부터 스타트업 코파운더, 사이드프로젝트 팀원과 온라인 스터디모임까지. 개발자·디자이너·기획자·마케터와 함께할 팀을 찾아보세요.",
  },
  clip: {
    path: "/clip",
    title: "해커블 클립 | 정보·후기·가이드",
    description:
      "바이브코딩 시작 가이드, 해커톤 후기, 직무별 포트폴리오, 지원사업 신청 팁까지. 먼저 도전해 본 사람들의 기록을 읽어보세요.",
  },
  subscribe: {
    path: "/newsletter/subscribe",
    title: "해커블 구독 | 해커톤·지원사업 주간 소식",
    description:
      "매주 화요일, 마감 임박 해커톤·AI공모전·예비창업 지원사업과 주간 소식을 메일로 받아보세요. 구독은 무료예요.",
  },
  unsubscribe: {
    path: "/newsletter/unsubscribe",
    title: "뉴스레터 수신 거부 | 해커블",
    description: "",
  },
  // 정보구조 문서에 없는 페이지 (기존 문구 유지)
  terms: {
    path: "/terms",
    title: "이용약관 | 해커블",
    description: "해커블 서비스 이용약관",
  },
  privacy: {
    path: "/privacy",
    title: "개인정보처리방침 | 해커블",
    description: "해커블 개인정보 처리방침",
  },
  // 로그인해야 보는 화면·글쓰기 화면은 검색에 내보내지 않는다. (noindex)
  mypage: { path: "/mypage", title: "마이페이지 | 해커블", description: "" },
  teamBuildingCreate: {
    path: "/teambuilding/create",
    title: "팀빌딩 모집글 작성 | 해커블",
    description: "",
  },
  teamBuildingEdit: { title: "팀빌딩 모집글 수정 | 해커블", description: "" },
  notFound: { title: "페이지를 찾을 수 없어요 | 해커블", description: "" },
};

// 상세 데이터를 못 찾았을 때 제목에 쓰는 이름
export const detailFallbackName = {
  aiHackathon: "AI해커톤",
  aiContest: "AI공모전",
  startupCompetition: "창업경진대회",
  startupSupport: "지원사업",
  teamBuilding: "팀빌딩",
  clip: "클립",
};
