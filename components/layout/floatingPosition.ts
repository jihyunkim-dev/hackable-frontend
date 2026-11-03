// 플로팅 버튼 공통 모양. 모바일에서는 하단 탭바 바로 위에 띄운다.
const FLOATING_BASE =
  "fixed z-40 flex items-center justify-center shadow-lg transition-transform hover:scale-105";

// 화면 우측 하단 자리 (구독 버튼·팀빌딩 작성 버튼)
export const FLOATING_POSITION = `${FLOATING_BASE} right-4 bottom-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom)+16px)] md:right-8 md:bottom-8`;

// 화면 가운데 하단 자리 (대회·지원사업 상세 참여하기 버튼)
// 우측 구독 버튼과 같은 높이 줄에 띄운다. (버튼 높이도 구독 버튼과 같게 쓴다)
export const FLOATING_CENTER_POSITION = `${FLOATING_BASE} left-1/2 -translate-x-1/2 bottom-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom)+16px)] md:bottom-8`;
