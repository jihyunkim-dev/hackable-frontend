"use client";

import type { ComponentProps } from "react";
import PromoBanner from "@/components/section/PromoBanner";
import Carousel from "@/components/ui/Carousel";
import CarouselCounter from "@/components/ui/CarouselCounter";
import { cn } from "@/lib/utils";

type Banner = Omit<ComponentProps<typeof PromoBanner>, "className">;

interface BannerCarouselProps {
  banners: Banner[];
  className?: string;
}

// 프로모션 배너 캐러셀 (가운데 점 표시 + 오른쪽 아래 "< 1 / N >" 이동 버튼)
export default function BannerCarousel({
  banners,
  className,
}: BannerCarouselProps) {
  return (
    <Carousel
      label="해커블 프로모션"
      options={{ loop: true }}
      autoplayDelay={5000}
      className={className}
      renderControls={({
        selectedIndex,
        count,
        scrollPrev,
        scrollNext,
        scrollTo,
      }) => (
        <>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`${index + 1}번째 배너 보기`}
                aria-current={index === selectedIndex}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1 rounded-full bg-gray-300 transition-all sm:h-2",
                  index === selectedIndex
                    ? "w-5 bg-primary-400 sm:w-8"
                    : "w-1 sm:w-2",
                )}
              />
            ))}
          </div>

          <CarouselCounter
            selectedIndex={selectedIndex}
            count={count}
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            prevLabel="이전 배너"
            nextLabel="다음 배너"
            className="absolute right-3 bottom-2 sm:right-4 sm:bottom-3"
          />
        </>
      )}
    >
      {banners.map((banner, index) => (
        <PromoBanner key={banner.alt} {...banner} priority={index === 0} />
      ))}
    </Carousel>
  );
}
