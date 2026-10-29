import Image from "next/image";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

// 캐러셀 "< 1 / N >" 이동 버튼 겸 위치 표시. 위치(absolute 등)는 className으로 정한다.
export default function CarouselCounter({
  selectedIndex,
  count,
  scrollPrev,
  scrollNext,
  prevLabel = "이전",
  nextLabel = "다음",
  className,
}: {
  selectedIndex: number;
  count: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-6 items-center gap-2 rounded-full bg-gray-800 px-2 text-label-s font-extrabold text-white sm:h-8 sm:gap-3 sm:px-3 sm:text-label-m",
        className,
      )}
    >
      <button type="button" aria-label={prevLabel} onClick={scrollPrev}>
        <Image
          src={commonIconUrl.chevronSmall}
          alt=""
          width={10}
          height={5}
          className="rotate-90"
        />
      </button>
      <span aria-live="polite">
        {selectedIndex + 1} / {count}
      </span>
      <button type="button" aria-label={nextLabel} onClick={scrollNext}>
        <Image
          src={commonIconUrl.chevronSmall}
          alt=""
          width={10}
          height={5}
          className="-rotate-90"
        />
      </button>
    </div>
  );
}
