import { bannerImageUrl, stripBannerUrl } from "@/configs/urls";

// 배너는 디자인된 그래픽 이미지라 문구를 대체 텍스트로 함께 관리한다.
export const bannerContent = {
  project: {
    images: bannerImageUrl.project,
    alt: "hackable. 일일이 찾아보던 해커톤과 공모전 한 번에 받아보기",
    href: "/newsletter/subscribe",
  },
  hackathon: {
    images: bannerImageUrl.hackathon,
    alt: "당신이 놓친 수많은 기회들, 해커블이 찾아드려요. 구독하기",
    href: "/newsletter/subscribe",
  },
  contest: {
    images: bannerImageUrl.contest,
    alt: "아는 사람만 제때 지원합니다. 공모전, 이제 해커블에서 만나보세요. 구독하기",
    href: "/newsletter/subscribe",
  },
  grants: {
    images: bannerImageUrl.grants,
    alt: "사업을 키울 기회, 놓치지 않도록 해커블이 모아드릴게요. 구독하기",
    href: "/newsletter/subscribe",
  },
  startupSupport: {
    images: bannerImageUrl.startupSupport,
    alt: "놓치기 쉬운 지원사업, 해커블이 모아드릴게요. 구독하기",
    href: "/newsletter/subscribe",
  },
  teamBuilding: {
    images: bannerImageUrl.teamBuilding,
    alt: "잘하는 사람보다 잘 맞는 사람이 필요할 때. 함께 일하는 방식부터 실력까지 검증은 해커블에서 시작하세요.",
  },
  subscribe: {
    images: bannerImageUrl.subscribe,
    alt: "hackable. 지원사업부터 공모전, 해커톤까지 모든 정보를 해커블에서 한번에 받아보세요",
    href: "/newsletter/subscribe",
  },
};

// 팀빌딩 상세 캐러셀 띠배너 (원본: 배너/문구_링크_정리.md). alt = 위 한 줄 + 큰 제목
export const stripBannerContent = [
  {
    images: stripBannerUrl.teamBuilding,
    alt: "대회는 찾았는데 팀이 없다면? 남은 한 자리, 해커블에서 채워요",
    href: "/teambuilding",
  },
  {
    images: stripBannerUrl.startupSupport,
    alt: "마감 지나고 알면 늦어요. 창업 지원사업, 마감 전에 한눈에",
    href: "/startup-support",
  },
  {
    images: stripBannerUrl.clip,
    alt: "AI 툴, 다 써볼 시간 없죠? 써본 사람이 정리한 AI 실전 노하우",
    href: "/clip",
  },
  {
    images: stripBannerUrl.hackathon,
    alt: "이번 주말, 밤샐 곳 찾았어요? AI·바이브코딩 해커톤 일정 모음",
    href: "/project/ai-hackathon",
  },
  {
    images: stripBannerUrl.kakao,
    alt: "마감 지나고 알면 늦어요. 최신 공모전·해커톤 정보, 카톡에서 받아보기",
    // 카카오톡 오픈채팅 (새 탭)
    href: "https://open.kakao.com/o/g5MKWici",
  },
];
