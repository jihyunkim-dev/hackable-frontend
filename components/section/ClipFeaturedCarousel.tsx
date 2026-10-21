"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/ui/Carousel";
import { commonIconUrl } from "@/configs/urls";

export interface FeaturedClip {
  id: string;
  category: string;
  title: string[];
  image: string;
  href: string;
}

// 추천 클립 캐러셀. 이미지 위에 카테고리·제목, 오른쪽 아래에 "1 / N" 이동 버튼
export default function ClipFeaturedCarousel({
  label,
  items,
}: {
  label: string;
  items: FeaturedClip[];
}) {
  return (
    <Carousel
      label={label}
      options={{ loop: true }}
      autoplayDelay={5000}
      className="rounded-lg lg:rounded-3xl"
      renderControls={({ selectedIndex, count, scrollPrev, scrollNext }) => (
        <div className="absolute right-2 bottom-3 flex items-center gap-2 rounded-full bg-gray-800 px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-white lg:right-4 lg:bottom-5 lg:gap-3 lg:px-3 lg:py-1.5 lg:text-label-m">
          <button type="button" aria-label="이전 클립" onClick={scrollPrev}>
            <Image src={commonIconUrl.chevronSmall} alt="" width={10} height={5} className="rotate-90" />
          </button>
          <span aria-live="polite">
            {selectedIndex + 1} / {count}
          </span>
          <button type="button" aria-label="다음 클립" onClick={scrollNext}>
            <Image src={commonIconUrl.chevronSmall} alt="" width={10} height={5} className="-rotate-90" />
          </button>
        </div>
      )}
    >
      {items.map((item, index) => (
        <Link
          key={item.id}
          href={item.href}
          className="relative block aspect-[352/188] lg:aspect-[777/400]"
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="(min-width: 1200px) 777px, 100vw"
            className="object-cover object-top"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-black/5 from-40% via-[#1e1e1e]/65 via-70% to-[#1f1f1f]/95"
          />
          <span className="absolute bottom-2 left-0 flex max-w-[70%] flex-col p-1 text-white lg:bottom-7 lg:left-1">
            <span className="px-1 text-label-m font-bold">{item.category}</span>
            <span className="px-1 text-heading-s font-extrabold">
              {item.title.map((line, lineIndex) => (
                <span key={line} className="block">
                  {line}
                  {lineIndex < item.title.length - 1 && " "}
                </span>
              ))}
            </span>
          </span>
        </Link>
      ))}
    </Carousel>
  );
}
