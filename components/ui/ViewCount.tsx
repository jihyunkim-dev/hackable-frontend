"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ViewTarget } from "@/utils/requestToSrv";

// 같은 글은 30분 안에 다시 열어도 한 번만 센다. 30분이 지나 다시 열면 또 센다.
// (새로고침·잠깐 다른 글에 다녀오기로 조회수가 부풀지 않게 한다)
const RECOUNT_AFTER_MS = 30 * 60 * 1000;

// 이 브라우저에서 센 글: 마지막으로 센 시각과 그때 받은 조회수. { "project:12": { at, views } }
// 탭을 새로 열어도 같은 기준을 쓰도록 localStorage에 둔다.
const SEEN_KEY = "hk_views";

type SeenEntry = { at: number; views: number };
type SeenViews = Record<string, SeenEntry>;

function readSeen(): SeenViews | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}");
    // 깨진 값은 비운다.
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as SeenViews)
      : {};
  } catch {
    // 저장소를 못 쓰는 브라우저(사생활 보호 모드 등)는 열 때마다 센다.
    return null;
  }
}

// 기록을 남기면서 30분이 지난 기록은 지워 저장소가 계속 커지지 않게 한다.
function writeSeen(key: string, entry: SeenEntry) {
  try {
    const now = Date.now();
    const kept = Object.entries(readSeen() ?? {}).filter(
      ([, value]) => now - value.at < RECOUNT_AFTER_MS,
    );
    localStorage.setItem(
      SEEN_KEY,
      JSON.stringify({ ...Object.fromEntries(kept), [key]: entry }),
    );
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
// 보여 주는 값: 캐시된 값·기억해 둔 값·방금 받은 값 중 가장 큰 값
export default function ViewCount({ type, id, initial }: ViewCountProps) {
  const key = `${type}:${id}`;
  const [counted, setCounted] = useState(0);
  const remembered = useSyncExternalStore(
    noSubscribe,
    () => readSeen()?.[key]?.views ?? 0,
    getServerSeen,
  );

  useEffect(() => {
    const seen = readSeen();
    const last = seen?.[key];
    // 30분 안에 센 글은 다시 세지 않는다.
    if (last && Date.now() - last.at < RECOUNT_AFTER_MS) return;

    // 요청 전에 먼저 적어 둬, 개발 모드의 effect 두 번 실행에도 한 번만 센다.
    writeSeen(key, { at: Date.now(), views: last?.views ?? 0 });
    fetch(`/api/views/${type}/${id}`, { method: "POST" })
      .then((res) => (res.ok && res.status !== 204 ? res.json() : null))
      .then((data: { views: number } | null) => {
        if (!data) return;
        setCounted(data.views);
        writeSeen(key, { at: Date.now(), views: data.views });
      })
      .catch(() => {});
  }, [key, type, id]);

  return <>{Math.max(initial, remembered, counted).toLocaleString()}</>;
}
