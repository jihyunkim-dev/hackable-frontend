"use client";

import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { cn } from "@/lib/utils";

interface FloatingSearchBarProps {
  action: string;
  placeholder: string;
  // 지금 검색 중인 검색어 (두 검색창에 같이 남겨둔다)
  query?: string;
  className?: string;
}

// 페이지 위쪽 검색창. 스크롤해서 헤더 뒤로 사라지면 같은 검색창이 화면 아래에서 올라와 떠 있는다.
// 다시 위로 올라가 원래 검색창이 보이면 아래 검색창은 내려가며 사라진다.
// 아래 검색창은 오른쪽 아래 플로팅 버튼(components/layout/FloatingButton)과 겹치지 않게 그 왼쪽까지만 쓴다.
export default function FloatingSearchBar({
  action,
  placeholder,
  query,
  className,
}: FloatingSearchBarProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    // 고정 헤더 아래부터를 "보이는 영역"으로 본다.
    const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const observer = new IntersectionObserver(
      ([entry]) =>
        // 위로 지나가서 안 보일 때만 띄운다. (페이지가 짧아 아래에 있는 경우는 제외)
        setFloating(
          !entry.isIntersecting && entry.boundingClientRect.top < headerHeight,
        ),
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={anchorRef} className={cn("flex justify-center", className)}>
        <SearchBar
          // 검색어가 바뀌면 입력창도 새 값으로 다시 그린다.
          key={query}
          action={action}
          placeholder={placeholder}
          defaultValue={query}
        />
      </div>

      {/* 플로팅 버튼과 같은 높이(모바일 52px, md 64px) 줄에 세로 가운데로 놓는다. */}
      <div
        // 숨어 있을 때는 키보드 이동·스크린 리더에서도 빠진다.
        inert={!floating}
        className={cn(
          "fixed bottom-[calc(var(--navbar-height-mobile)+env(safe-area-inset-bottom)+16px)] left-4 right-[84px] z-40 flex h-13 items-center transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none md:inset-x-0 md:bottom-8 md:h-16 md:justify-center md:px-28",
          floating
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[calc(100%+32px)] opacity-0",
        )}
      >
        <SearchBar
          key={query}
          action={action}
          placeholder={placeholder}
          defaultValue={query}
          className="max-w-none shadow-lg sm:max-w-[560px] lg:max-w-[620px]"
        />
      </div>
    </>
  );
}
