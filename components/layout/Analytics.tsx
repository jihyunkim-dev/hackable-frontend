"use client";

import Script from "next/script";
import { useEffect } from "react";
import {
  GA_ID,
  getPageContent,
  initAnalytics,
  isAnalyticsEnabled,
  LOGIN_EVENT_COOKIE,
  LOGIN_METHODS,
  track,
  type AnalyticsEventName,
  type AnalyticsEvents,
  type LoginMethod,
} from "@/lib/analytics";

// GA4 gtag.js를 받고, data-ga-event가 붙은 링크·버튼의 클릭을 보낸다. (lib/analytics)
// 스크립트(약 180KB)는 페이지 로드가 끝나고 브라우저가 한가할 때 받는다. (lazyOnload)
// 일찍 받으면 첫 화면 이미지·폰트와 대역폭을 나눠 써 LCP가 늦어진다.
// 그 전에 보낸 페이지뷰·이벤트는 dataLayer에 쌓였다가 스크립트가 받아지면 순서대로 보낸다.
export default function Analytics() {
  useEffect(() => {
    initAnalytics();
    trackLoginFromCookie();

    // 링크 이동보다 먼저 잡도록 capture 단계에서 듣는다.
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-ga-event]",
      );
      if (!target) return;
      const name = target.dataset.gaEvent as AnalyticsEventName;
      const params = JSON.parse(target.dataset.gaParams ?? "{}");
      // 참여하기는 어느 공고에서 눌렀는지 주소에서 채운다.
      const page =
        name === "apply_click" ? getPageContent(window.location.pathname) : {};
      track(name, { ...page, ...params } as AnalyticsEvents[typeof name]);
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!isAnalyticsEnabled) return null;
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="lazyOnload"
    />
  );
}

function trackLoginFromCookie() {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${LOGIN_EVENT_COOKIE}=`))
    ?.split("=")[1];
  if (!value) return;
  document.cookie = `${LOGIN_EVENT_COOKIE}=; Max-Age=0; Path=/`;
  if (LOGIN_METHODS.includes(value as LoginMethod)) {
    track("login", { method: value as LoginMethod });
  }
}
