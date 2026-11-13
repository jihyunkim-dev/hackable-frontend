"use client";

import { useEffect, useRef, useState } from "react";
import type { ViewTarget } from "@/utils/requestToSrv";

interface ViewCountProps {
  type: ViewTarget;
  id: string;
  // 캐시된 상세 데이터의 조회수 (최대 1시간 전 값)
  initial: number;
}

// 상세 페이지 조회수. 페이지를 열 때마다 방문 한 번을 알리고(app/api/views), 최신 조회수를 보여 준다.
// 중복은 거르지 않는다. 새로고침·다시 열기도 매번 센다. (봇은 app/api/views에서 거른다)
// 미리 불러오기(prefetch)는 이 컴포넌트를 실행하지 않아 세지 않는다.
export default function ViewCount({ type, id, initial }: ViewCountProps) {
  const key = `${type}:${id}`;
  const [counted, setCounted] = useState(0);
  // 개발 모드에서 effect가 두 번 실행돼도 한 번 연 것을 두 번 세지 않게 한다.
  const sentKey = useRef<string | null>(null);

  useEffect(() => {
    if (sentKey.current === key) return;
    sentKey.current = key;

    fetch(`/api/views/${type}/${id}`, { method: "POST" })
      .then((res) => (res.ok && res.status !== 204 ? res.json() : null))
      .then((data: { views: number } | null) => {
        if (data) setCounted(data.views);
      })
      .catch(() => {});
  }, [key, type, id]);

  return <>{Math.max(initial, counted).toLocaleString()}</>;
}
