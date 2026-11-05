// GA4 이벤트 전송. (gtag.js, 스크립트는 components/layout/Analytics)
// - 측정 ID(NEXT_PUBLIC_GA_ID)가 없거나 운영 빌드가 아니면 보내지 않는다. 개발 중에는 콘솔에만 찍는다.
// - 페이지뷰·스크롤·이탈 클릭·사이트 검색은 GA4 향상된 측정이 자동으로 잡는다. 여기서는 보내지 않는다.
// - 이메일·이름·토큰 같은 개인정보는 보내지 않는다.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const isAnalyticsEnabled =
  Boolean(GA_ID) && process.env.NODE_ENV === "production";

export type ContentType = "project" | "grant" | "teambuilding" | "clip";

// 상세 페이지에서 공통으로 붙이는 값 (주소에서 읽는다. getPageContent)
interface PageContent {
  content_type?: ContentType;
  item_id?: string;
  item_category?: string;
}

export type LoginTrigger =
  "header" | "bookmark" | "teambuilding_create" | "login_gate";

// 이벤트 이름과 함께 보내는 값. GA4 권장 이벤트(generate_lead·login·share·select_promotion)는 권장 이름을 쓴다.
export interface AnalyticsEvents {
  // 핵심 전환
  generate_lead: { location: "subscribe_page" };
  apply_click: PageContent & { location: "sidebar" | "floating" };
  login: { method: LoginMethod };
  teambuilding_create: { item_category: string; position: string };
  // 참여 행동
  bookmark_add: { content_type: ContentType; item_id: string };
  bookmark_remove: { content_type: ContentType; item_id: string };
  share: PageContent & { method: "native" | "copy" };
  select_promotion: { promotion_name: string };
  subscribe_cta_click: { location: "header" | "floating" | "main_section" };
  login_modal_open: { trigger: LoginTrigger };
  newsletter_unsubscribe: Record<string, never>;
}

export type AnalyticsEventName = keyof AnalyticsEvents;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// gtag.js가 읽는 대기열에 넣는다. gtag.js가 늦게 받아져도 넣어 둔 순서대로 보낸다.
// (gtag.js는 배열이 아닌 arguments 객체를 받아야 처리한다)
const gtag: (...args: unknown[]) => void = function () {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params -- gtag.js 규격
  window.dataLayer.push(arguments);
};

let initialized = false;

// 측정 ID를 등록한다. 이때 첫 페이지뷰가 잡힌다. 이후 페이지 이동은 향상된 측정이 잡는다.
export function initAnalytics() {
  if (initialized || !isAnalyticsEnabled) return;
  initialized = true;
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function track<E extends AnalyticsEventName>(
  event: E,
  params: AnalyticsEvents[E],
) {
  if (!GA_ID) return;
  if (!isAnalyticsEnabled) {
    console.debug("[GA]", event, params);
    return;
  }
  initAnalytics();
  gtag("event", event, params);
}

// 상세 페이지 주소에서 콘텐츠 종류·id·카테고리를 읽는다.
// 예: /project/ai-hackathon/1269-... → project · 1269 · ai-hackathon
export function getPageContent(pathname: string): PageContent {
  const [section, second, third] = pathname.split("/").filter(Boolean);
  const idOf = (slug: string) => /^\d+/.exec(slug)?.[0] ?? slug;

  if (section === "project" && third) {
    return {
      content_type: "project",
      item_id: idOf(third),
      item_category: second,
    };
  }
  if (section === "startup-support" && second) {
    return { content_type: "grant", item_id: idOf(second) };
  }
  if (section === "teambuilding" && second && second !== "create") {
    return { content_type: "teambuilding", item_id: idOf(second) };
  }
  if (section === "clip" && second) {
    return { content_type: "clip", item_id: idOf(second) };
  }
  return {};
}

// 링크·버튼에 붙이는 이벤트 표시. 클릭하면 components/layout/Analytics가 읽어 보낸다.
// 서버 컴포넌트에서도 쓸 수 있다. apply_click의 공고 값(getPageContent)은 클릭할 때 주소에서 채운다.
export function gaAttrs<E extends AnalyticsEventName>(
  event: E,
  params: Omit<AnalyticsEvents[E], keyof PageContent>,
) {
  return {
    "data-ga-event": event,
    "data-ga-params": JSON.stringify(params),
  };
}

// 소셜 로그인을 마치면 서버가 이 쿠키에 로그인 방식을 1분 동안 남긴다. (utils/authSession finishSocialLogin)
// 돌아온 페이지에서 읽어 login 이벤트를 보내고 지운다. (components/layout/Analytics)
export const LOGIN_EVENT_COOKIE = "hk_login_method";
export const LOGIN_METHODS = ["kakao", "google"] as const;
export type LoginMethod = (typeof LOGIN_METHODS)[number];
