import { cn } from "@/lib/utils";

interface TextLogoThumbnailProps {
  // 가운데에 크게 보여 줄 이름 (주관 기관명)
  name: string;
  // card: 목록 카드 썸네일 / detail: 상세 상단·요약 카드 이미지
  size?: "card" | "detail";
  className?: string;
}

// 이미지가 없는 공고 썸네일. 흰 배경 가운데에 기관명을 텍스트 로고처럼 보여 준다.
// 부모가 크기를 정하고(relative + 높이), 이 요소가 그 칸을 꽉 채운다.
export default function TextLogoThumbnail({
  name,
  size = "card",
  className,
}: TextLogoThumbnailProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center border border-gray-100 bg-white p-4 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "line-clamp-3 font-extrabold break-keep text-gray-800",
          size === "card"
            ? "text-label-l sm:text-heading-s"
            : "text-heading-s lg:text-heading-m",
        )}
      >
        {name}
      </span>
    </div>
  );
}
