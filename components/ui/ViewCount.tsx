"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ViewTarget } from "@/utils/requestToSrv";

// 같은 탭에서 이미 센 글과 그때 받은 조회수. { "project:12": 34 }
// 새로고침·뒤로 가기로 다시 열면 세지 않고, 기억해 둔 조회수를 보여 준다.
// (값이 0이면 세는 중이거나 응답을 못 받은 것)
const SEEN_KEY = "hk_viewed";

type SeenViews = Record<string, number>;

function readSeen(): SeenViews | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "{}");
    // 예전 형식(배열)이나 깨진 값은 비운다.
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as SeenViews)
      : {};
  } catch {
    // 저장소를 못 쓰는 브라우저(사생활 보호 모드 등)는 매번 센다.
    return null;
  }
}

function writeSeen(key: string, views: number) {
  try {
    const seen = readSeen() ?? {};
    sessionStorage.setItem(SEEN_KEY, JSON.stringify({ ...seen, [key]: views }));
  } catch {
    // 저장하지 못해도 화면 숫자는 그대로 쓴다.
  }
}

interface ViewCountProps {
  type: ViewTarget;
  id: string;
  // 캐시된 상세 데이터의 조회수 (최대 1시간 전 값)
  initial: number;
}

// 기억해 둔 조회수는 브라우저에서만 읽는다. (서버 렌더링·하이드레이션 중에는 없음)
const noSubscribe = () => () => {};
const getServerSeen = () => 0;

// 상세 페이지 조회수. 페이지가 열리면 방문 한 번을 알리고(app/api/views), 최신 조회수를 보여 준다.
// 미리 불러오기(prefetch)는 이 컴포넌트를 실행하지 않아 세지 않는다.
// 보여 주는 값: 캐시된 값·이 탭에서 기억해 둔 값·방금 받은 값 중 가장 큰 값
export default function ViewCount({ type, id, initial }: ViewCountProps) {
  const key = `${type}:${id}`;
  const [counted, setCounted] = useState(0);
  const remembered = useSyncExternalStore(
    noSubscribe,
    () => readSeen()?.[key] ?? 0,
    getServerSeen,
  );

  useEffect(() => {
    // 이미 센 글은 다시 세지 않는다.
    const seen = readSeen();
    if (seen && key in seen) return;

    // 요청 전에 먼저 적어 둬, 개발 모드의 effect 두 번 실행에도 한 번만 센다.
    writeSeen(key, 0);
    fetch(`/api/views/${type}/${id}`, { method: "POST" })
      .then((res) => (res.ok && res.status !== 204 ? res.json() : null))
      .then((data: { views: number } | null) => {
        if (!data) return;
        setCounted(data.views);
        writeSeen(key, data.views);
      })
      .catch(() => {});
  }, [key, type, id]);

  return <>{Math.max(initial, remembered, counted).toLocaleString()}</>;
}
