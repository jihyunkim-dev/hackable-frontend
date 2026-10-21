"use client";

import { useEffect, useState } from "react";

// 화면 상단에 가장 가까이 지나간 제목의 id를 돌려준다. (목차 활성 표시용)
export function useActiveHeading(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: `-${offset}px 0px -60% 0px` },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
