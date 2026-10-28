"use client";

import { useEffect, useRef } from "react";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import { cn } from "@/lib/utils";

// 클립 본문 목차. 현재 읽고 있는 제목을 강조한다.
export default function ClipToc({
  label,
  headings,
}: {
  label: string;
  headings: { id: string; text: string }[];
}) {
  const activeId = useActiveHeading(headings.map((heading) => heading.id));
  const navRef = useRef<HTMLElement>(null);

  // 목차가 길어 안에서 스크롤될 때, 강조된 항목이 목차 안에 보이도록 목차만 움직인다. (페이지는 그대로)
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !link) return;
    const top = link.offsetTop - nav.offsetTop;
    if (
      top < nav.scrollTop ||
      top + link.offsetHeight > nav.scrollTop + nav.clientHeight
    ) {
      nav.scrollTo({ top: top - nav.clientHeight / 2, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      // 제목이 많아도 화면 안에 들어오도록 높이를 제한하고 안에서 스크롤한다.
      className="max-h-[calc(100dvh-var(--header-height-desktop)-48px)] overflow-y-auto rounded-[18px] border border-gray-200 p-3"
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
    </nav>
  );
}
