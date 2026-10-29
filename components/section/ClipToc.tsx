"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import { cn } from "@/lib/utils";

// 클립 본문 목차. 현재 읽고 있는 제목을 강조한다.
// 높이를 고정하고, 읽는 위치가 바뀌면 강조된 항목이 가운데 오도록 목차를 올리고 내린다.
// 위·아래로 더 있는 항목은 끝을 흐리게 덮어 "더 있다"는 것만 보여 준다.
export default function ClipToc({
  label,
  headings,
}: {
  label: string;
  headings: { id: string; text: string }[];
}) {
  const activeId = useActiveHeading(headings.map((heading) => heading.id));
  const listRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ top: false, bottom: false });

  const updateOverflow = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const top = list.scrollTop > 1;
    const bottom = list.scrollTop + list.clientHeight < list.scrollHeight - 1;
    setOverflow((prev) =>
      prev.top === top && prev.bottom === bottom ? prev : { top, bottom },
    );
  }, []);

  useEffect(() => {
    updateOverflow();
    window.addEventListener("resize", updateOverflow);
    return () => window.removeEventListener("resize", updateOverflow);
  }, [updateOverflow]);

  // 강조된 항목을 목차 가운데로 옮긴다. (목차만 움직이고 페이지는 그대로)
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !link) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollTo({
      top: link.offsetTop - list.clientHeight / 2 + link.offsetHeight / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeId]);

  return (
    <nav
      aria-label={label}
      className="relative overflow-hidden rounded-[18px] border border-gray-200 bg-white"
    >
      <div
        ref={listRef}
        onScroll={updateOverflow}
        // 고정 높이 안에서만 움직인다. 스크롤바는 숨기고 휠·키보드로는 직접 넘겨 볼 수 있다.
        className="relative max-h-[280px] overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ol className="flex flex-col gap-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={heading.id === activeId ? "location" : undefined}
                className={cn(
                  "block text-label-s font-bold transition-colors",
                  heading.id === activeId
                    ? "text-primary-400"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <TocFade edge="top" visible={overflow.top} />
      <TocFade edge="bottom" visible={overflow.bottom} />
    </nav>
  );
}

// 더 있는 쪽 끝을 흰색으로 흐리게 덮는다. 끝에 닿으면 서서히 사라진다.
function TocFade({
  edge,
  visible,
}: {
  edge: "top" | "bottom";
  visible: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 h-14 from-white to-transparent transition-opacity duration-300 motion-reduce:transition-none",
        edge === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
