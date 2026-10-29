"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import CarouselCounter from "@/components/ui/CarouselCounter";
import MultiLine from "@/components/ui/MultiLine";
import type { MainCarouselSlide } from "@/configs/contents/main";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 5000;

export function HeroCarousel({ slides }: { slides: MainCarouselSlide[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    // 모바일: [카드(이미지 + 정보)] → [버튼] 세로 배치
    // md 이상: 왼쪽 이미지, 오른쪽 위 정보 / 오른쪽 아래 버튼 그리드 배치
    <div className="mx-auto flex max-w-[1080px] flex-col px-3 md:grid md:grid-cols-[480px_340px] md:grid-rows-[1fr_auto] md:justify-center md:gap-x-10 lg:grid-cols-[640px_360px]">
      {/* 모바일에서 이미지와 정보를 한 장의 카드로 묶는다. md 이상에서는 묶음을 풀어 그리드 칸에 배치 */}
      <div className="overflow-hidden rounded-xl bg-gray-50 md:contents">
        <Carousel
          label="해커블 소식"
          options={{ loop: true }}
          autoplayDelay={AUTOPLAY_DELAY}
          onSelectIndex={setSelectedIndex}
          // md 이상: 이미지 높이가 오른쪽 칸 높이가 된다. (정보는 이미지 위쪽, 버튼은 이미지 아래쪽 끝에 맞춘다)
          className="w-full md:row-span-2 md:self-start"
          renderControls={({
            selectedIndex: current,
            count,
            scrollPrev,
            scrollNext,
          }) => (
            // 이미지 안 오른쪽 아래에 여유를 두고 "< 1 / N >"만 둔다. (위치 표시 겸 이동 버튼)
            <CarouselCounter
              selectedIndex={current}
              count={count}
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              prevLabel="이전 소식"
              nextLabel="다음 소식"
              className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 md:right-5 md:bottom-5"
            />
          )}
        >
          {slides.map((slide, index) => (
            // 캐러셀 이미지는 16:9 (1920x1080) 기준. md 이상에서는 이미지 칸만 둥글게 자른다.
            <div
              key={slide.id}
              className="relative aspect-video overflow-hidden md:rounded-[20px]"
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="(min-width: 1200px) 640px, (min-width: 991px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </Carousel>

        {/* 모든 슬라이드 정보를 같은 칸에 겹쳐 두고 선택된 것만 보이게 해 높이 변화 없이 전환한다. */}
        <div className="grid md:col-start-2 md:row-start-1">
          {slides.map((slide, index) => (
            <SlideFade key={slide.id} isSelected={index === selectedIndex}>
              <div className="flex flex-col gap-4 px-3 py-5 md:p-0">
                <div className="flex flex-col gap-2 p-2">
                  <p className="text-label-m font-bold text-primary-500">
                    {slide.category}
                  </p>
                  <h2 className="text-heading-s font-bold text-gray-800">
                    {slide.title}
                  </h2>
                </div>
                <p className="p-2 text-body-m text-gray-800 md:hidden">
                  <MultiLine lines={slide.description.mobile} />
                </p>
                <p className="hidden p-2 text-body-s text-gray-800 md:block">
                  <MultiLine lines={slide.description.desktop} />
                </p>
              </div>
            </SlideFade>
          ))}
        </div>
      </div>

      <div className="mt-10 grid md:col-start-2 md:row-start-2 md:mt-0">
        {slides.map((slide, index) => (
          <SlideFade key={slide.id} isSelected={index === selectedIndex}>
            <Button
              asChild
              className="w-full md:h-12 md:text-label-l md:shadow-xl"
            >
              <Link href={slide.href}>{slide.buttonLabel}</Link>
            </Button>
          </SlideFade>
        ))}
      </div>
    </div>
  );
}

// 선택된 슬라이드만 보이고, 나머지는 겹친 채로 숨겨 포커스·스크린리더에서 제외한다.
function SlideFade({
  isSelected,
  children,
}: {
  isSelected: boolean;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={!isSelected}
      inert={!isSelected}
      className={cn(
        "col-start-1 row-start-1 transition-opacity duration-500 ease-out motion-reduce:transition-none",
        isSelected ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
}
