"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { Children, ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

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
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              // 움직임 줄이기 설정 사용자는 자동 넘김을 끈다.
              breakpoints: {
                "(prefers-reduced-motion: reduce)": { active: false },
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
