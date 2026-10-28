import Image from "next/image";
import Link from "next/link";
import BookmarkToggle from "@/components/ui/BookmarkToggle";
import StatusBadge from "@/components/ui/StatusBadge";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

export interface TeamBuildingItem {
  id: string;
  isOpen: boolean;
  category: string;
  title: string;
  dDay: string;
  author: string;
  views: number;
  bookmarks: number;
  href: string;
}

// 카드 전체가 링크처럼 눌리도록 제목 링크를 카드 크기로 늘리고(after:inset-0), 북마크 버튼만 그 위에 올린다.
export default function TeamBuildingCard({
  item,
  showBookmark = false,
  className,
}: {
  item: TeamBuildingItem;
  // true면 오른쪽 위에 북마크 버튼 표시 (마이페이지 북마크 목록)
  showBookmark?: boolean;
  className?: string;
}) {
  const { remainingSuffix, viewsLabel, bookmarksLabel } =
    teamBuildingContent.card;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-1 rounded-xl border border-gray-100 bg-white p-2.5 transition-colors hover:border-gray-300 sm:gap-2.5 sm:border-gray-300 sm:px-3 sm:py-4 sm:hover:border-primary-300",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <StatusBadge isOpen={item.isOpen} />
        {showBookmark && (
          <BookmarkToggle
            type="teambuilding"
            id={item.id}
            label="북마크"
            icons={{
              off: {
                src: commonIconUrl.bookmarkOutline,
                width: 16,
                height: 21,
              },
              on: { src: commonIconUrl.bookmarkFilled, width: 16, height: 22 },
            }}
          />
        )}
      </div>
      <p className="py-1 text-heading-xs text-gray-800">{item.category}</p>
      <h3 className="line-clamp-3 text-heading-s font-bold text-gray-800">
        <Link href={item.href} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      <p className="flex items-center gap-1">
        <span className="text-heading-xs text-primary-600">{item.dDay}</span>
        {/* "상시"·"마감"에는 "남았어요"를 붙이지 않는다. */}
        {item.dDay.startsWith("D-") && (
          <span className="text-label-m text-gray-500">{remainingSuffix}</span>
        )}
      </p>
      <div className="mt-auto flex items-center gap-1 pt-4">
        <span className="py-1 text-label-m text-gray-800 sm:text-label-l">
          {item.author}
        </span>
        <span className="ml-auto flex items-center gap-1 p-1 text-label-m text-gray-500">
          <Image
            src={commonIconUrl.eyeSmall}
            alt={viewsLabel}
            width={20}
            height={20}
          />
          {item.views}
        </span>
        <span className="flex items-center gap-1 p-1 text-label-m text-gray-500">
          <Image
            src={commonIconUrl.bookmarkCount}
            alt={bookmarksLabel}
            width={12}
            height={15}
          />
          {item.bookmarks}
        </span>
      </div>
    </div>
  );
}
