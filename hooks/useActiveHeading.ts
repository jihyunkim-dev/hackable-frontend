"use client";

import { useEffect, useState } from "react";

// 지금 읽고 있는 제목의 id를 돌려준다. (목차 활성 표시용)
// - 화면 위쪽(offset)을 지나간 제목 중 마지막 것을 활성으로 본다.
// - 아직 첫 제목에 닿기 전이면 첫 제목, 페이지 맨 아래에 닿으면 마지막 제목을 활성으로 한다.
export function useActiveHeading(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState(ids[0]);
  // 렌더마다 새 배열이 와도 제목 목록이 같으면 다시 구독하지 않도록 문자열로 비교한다.
  const idsKey = ids.join("\n");

  useEffect(() => {
    const headingIds = idsKey ? idsKey.split("\n") : [];
    if (headingIds.length === 0) return;

    // 제목 몇 개의 위치만 읽으므로 스크롤마다 바로 계산한다.
    const update = () => {
      const elements = headingIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      if (elements.length === 0) return;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      const passed = elements.filter(
        (element) => element.getBoundingClientRect().top <= offset,
      );
      setActiveId((passed.at(-1) ?? elements[0]).id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [idsKey, offset]);

  return activeId;
}
