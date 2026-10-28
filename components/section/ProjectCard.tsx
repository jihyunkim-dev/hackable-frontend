import Image from "next/image";
import Link from "next/link";
import BookmarkToggle from "@/components/ui/BookmarkToggle";
import { commonIconUrl, placeholderImageUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

export interface ProjectItem {
  id: string;
  title: string;
  thumbnail: string | null; // 없으면 "이미지 준비중" 이미지
  dDay: string;
  prizeLabel: string;
  prize: string;
  href: string;
  // 북마크 API 종류. 지원사업 카드만 "grant" (기본 "project")
  bookmarkType?: "project" | "grant";
}

interface ProjectCardProps {
  item: ProjectItem;
  // elevated: 흰 배경 + 그림자(메인), plain: 배경 없음(목록)
  variant?: "elevated" | "plain";
  className?: string;
}

// 해커톤·공모전·지원사업 카드. xs는 180px, sm 이상은 300px 카드
// 카드 전체가 링크처럼 눌리도록 제목 링크를 카드 크기로 늘리고(after:inset-0), 북마크 버튼만 그 위에 올린다.
export default function ProjectCard({
  item,
  variant = "elevated",
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "relative flex w-[180px] shrink-0 flex-col gap-2 rounded-xl p-3 transition-shadow sm:w-[300px] sm:p-4",
        variant === "elevated"
          ? "bg-white shadow-sm hover:shadow-md sm:shadow-md sm:hover:shadow-lg"
          : "hover:bg-gray-50",
        className,
      )}
    >
      <div className="relative h-[150px] overflow-hidden rounded-sm shadow-xs sm:h-[284px] sm:rounded-lg sm:shadow-none">
        <Image
          src={item.thumbnail ?? placeholderImageUrl.thumbnail}
          alt=""
          fill
          sizes="(min-width: 768px) 268px, 156px"
          className="object-cover object-top"
        />
        <BookmarkToggle
          type={item.bookmarkType ?? "project"}
          id={item.id}
          label="북마크"
          icons={{
            off: { src: commonIconUrl.bookmarkCard, width: 25, height: 32 },
            on: {
              src: commonIconUrl.bookmarkCardFilled,
              width: 25,
              height: 32,
            },
          }}
          className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3"
          iconClassName="h-8 w-[25px] sm:h-10 sm:w-8"
        />
      </div>

      <h3 className="line-clamp-3 min-h-[76px] text-heading-xs text-gray-800 sm:line-clamp-2 sm:min-h-20">
        <Link href={item.href} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>

      <div className="flex flex-col sm:gap-2.5">
        <p className="text-label-m text-gray-600 sm:text-label-l">
          {item.dDay}
        </p>
        <p className="flex items-center gap-1">
          <span className="text-label-m text-gray-600 sm:text-label-l">
            {item.prizeLabel}
          </span>
          <span className="bg-linear-[97deg] from-rose-500 from-32% to-primary-500 to-97% bg-clip-text text-heading-xs font-extrabold text-transparent sm:text-heading-s sm:font-extrabold">
            {item.prize}
          </span>
        </p>
      </div>
    </div>
  );
}
