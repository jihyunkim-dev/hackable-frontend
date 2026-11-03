"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { Children, ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// 자동 넘김은 사용자가 페이지를 처음 움직였을 때(스크롤·터치·마우스·키보드) 시작한다.
// 움직임이 없어도 이 시간이 지나면 시작한다.
// 첫 화면이 다 그려진 뒤 곧바로 슬라이드가 바뀌면, 측정 도구(Lighthouse)가 화면이 계속 바뀌는 것으로 보고
// Speed Index를 크게 잡는다. 그래서 측정이 끝날 만큼 기다린 뒤에 시작한다.
// (느린 측정 환경에서 기록이 약 20초까지 이어져, 첫 넘김이 그 뒤에 오도록 20초 + 넘김 간격으로 둔다)
const AUTOPLAY_IDLE_START_MS = 20000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const AUTOPLAY_START_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

export interface CarouselControls {
  selectedIndex: number;
  count: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
}

interface CarouselProps {
  label: string;
  children: ReactNode;
  options?: EmblaOptionsType;
  // 자동 넘김 간격(ms). 지정하지 않으면 자동 넘김을 하지 않는다.
  autoplayDelay?: number;
  // 현재 슬라이드가 바뀔 때 index를 알려준다. (슬라이드 밖 영역 동기화용)
  onSelectIndex?: (index: number) => void;
  // 페이지 표시·이전/다음 버튼 등 캐러셀 위에 올릴 조작 UI
  renderControls?: (controls: CarouselControls) => ReactNode;
  className?: string;
  slideClassName?: string;
}

// 슬라이드는 서버에서 렌더링된 children을 그대로 받아 감싼다.
export default function Carousel({
  label,
  children,
  options,
  autoplayDelay,
  onSelectIndex,
  renderControls,
  className,
  slideClassName,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const isMultiple = slides.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const plugins = useMemo(
    () =>
      autoplayDelay
        ? [
            Autoplay({
              delay: autoplayDelay,
              // 처음 움직임(또는 일정 시간) 뒤에 시작한다. (아래 useEffect)
              playOnInit: false,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              // 움직임 줄이기 설정 사용자는 자동 넘김을 끈다.
              breakpoints: {
                [REDUCED_MOTION_QUERY]: { active: false },
              },
            }),
          ]
        : [],
    [autoplayDelay],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", active: isMultiple, ...options },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      onSelectIndex?.(index);
    };
    emblaApi.on("select", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onSelectIndex]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;
    // 슬라이드가 하나이거나 움직임 줄이기 설정이면 플러그인이 꺼져 있다. (꺼진 플러그인은 play하면 오류가 난다)
    if (
      !autoplay ||
      !isMultiple ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    const start = () => {
      stopWaiting();
      // 마우스가 캐러셀 위에 있으면 멈춘 상태를 지킨다. (마우스가 나가면 플러그인이 다시 시작한다)
      if (emblaApi.rootNode().matches(":hover")) return;
      autoplay.play();
    };
    const timer = window.setTimeout(start, AUTOPLAY_IDLE_START_MS);
    const stopWaiting = () => {
      window.clearTimeout(timer);
      AUTOPLAY_START_EVENTS.forEach((type) =>
        window.removeEventListener(type, start),
      );
    };
    AUTOPLAY_START_EVENTS.forEach((type) =>
      window.addEventListener(type, start, { passive: true }),
    );
    return stopWaiting;
  }, [emblaApi, isMultiple]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative overflow-hidden", className)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
              className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                slideClassName,
              )}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {isMultiple &&
        renderControls?.({
          selectedIndex,
          count: slides.length,
          scrollPrev: () => emblaApi?.scrollPrev(),
          scrollNext: () => emblaApi?.scrollNext(),
          scrollTo: (index) => emblaApi?.scrollTo(index),
        })}
    </div>
  );
}
