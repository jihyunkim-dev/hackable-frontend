// 화면 우측 하단 플로팅 버튼 자리. 모바일에서는 하단 탭바 바로 위에 띄운다.
// (구독 버튼·팀빌딩 작성 버튼·상세 참여하기 버튼이 같은 자리를 쓴다)
export const FLOATING_POSITION =
  "fixed right-4 bottom-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom)+16px)] z-40 flex items-center justify-center shadow-lg transition-transform hover:scale-105 md:right-8 md:bottom-8";
