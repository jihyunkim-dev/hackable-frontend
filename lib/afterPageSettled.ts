// 첫 페이지의 하이드레이션이 끝난 뒤 fn을 실행한다. 그 뒤로는 바로 실행한다.
// 모달(Radix Dialog)은 열릴 때 바깥 요소에 aria-hidden을 붙이는데, 아직 하이드레이션 전인
// Suspense 영역에 붙으면 서버 HTML과 속성이 달라져 하이드레이션 에러가 난다.
// 그래서 페이지가 뜨자마자 여는 모달(로그인 필요 페이지, 로그인 실패 안내)은 하이드레이션이 끝날 때까지 미룬다.
let settled = false;
const pending: (() => void)[] = [];

// 확장 프로그램이 넣은 요소처럼 끝까지 하이드레이션되지 않는 요소가 있어도 이 시간이 지나면 연다.
const MAX_WAIT_MS = 5000;
// 백그라운드 탭에서도 멈추지 않도록 requestAnimationFrame 대신 타이머로 확인한다.
const CHECK_INTERVAL_MS = 50;
// React가 하이드레이션하지 않는 요소는 검사하지 않는다.
// (태그, 숨겨진 스트리밍 조각, Next 개발 오버레이·경로 안내, Radix 포커스 가드, TanStack Query 개발 도구)
const SKIP_SELECTOR = [
  "script, style, link, template, noscript, [hidden]",
  "nextjs-portal, next-route-announcer",
  "[data-radix-focus-guard]",
  ".tsqd-transitions-container",
].join(", ");

// React는 하이드레이션한 DOM 요소에 __reactFiber$… 속성을 붙인다. 화면 요소가 모두 붙었는지 본다.
function isBodyHydrated() {
  for (const element of document.body.querySelectorAll("*")) {
    if (element.matches(SKIP_SELECTOR) || element.closest(SKIP_SELECTOR)) {
      continue;
    }
    // 스트리밍 중인 Suspense 자리(<template id="B:…"> 다음 요소)는 하이드레이션하지 않고 통째로 바뀐다.
    if (element.previousElementSibling?.id.startsWith("B:")) continue;
    if (!Object.keys(element).some((key) => key.startsWith("__reactFiber$"))) {
      return false;
    }
  }
  return true;
}

function settle() {
  settled = true;
  pending.splice(0).forEach((fn) => fn());
}

function waitForHydration() {
  const startedAt = performance.now();
  const check = () => {
    if (isBodyHydrated() || performance.now() - startedAt > MAX_WAIT_MS) {
      settle();
      return;
    }
    window.setTimeout(check, CHECK_INTERVAL_MS);
  };
  check();
}

export function afterPageSettled(fn: () => void) {
  if (settled || typeof window === "undefined") {
    fn();
    return;
  }

  pending.push(fn);
  // 이미 기다리는 중이면 같이 실행된다.
  if (pending.length > 1) return;

  if (document.readyState === "complete") waitForHydration();
  else window.addEventListener("load", waitForHydration, { once: true });
}
