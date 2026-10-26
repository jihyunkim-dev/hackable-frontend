import Image from "next/image";
import Link from "next/link";
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

export default function TeamBuildingCard({
  item,
  bookmarked = false,
  className,
}: {
  item: TeamBuildingItem;
  // true면 오른쪽 위에 북마크 표시 (마이페이지 북마크 목록)
  bookmarked?: boolean;
  className?: string;
}) {
  const { remainingSuffix, viewsLabel, bookmarksLabel } = teamBuildingContent.card;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-full flex-col gap-1 rounded-xl border border-gray-100 bg-white p-2.5 transition-colors hover:border-gray-300 sm:gap-2.5 sm:border-gray-300 sm:px-3 sm:py-4 sm:hover:border-primary-300",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <StatusBadge isOpen={item.isOpen} />
        {bookmarked && (
          <Image src={commonIconUrl.bookmarkFilled} alt="북마크함" width={16} height={22} />
        )}
      </div>
      <p className="py-1 text-heading-xs text-gray-800">{item.category}</p>
      <h3 className="line-clamp-3 text-heading-s font-bold text-gray-800">
        {item.title}
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
          <Image src={commonIconUrl.eyeSmall} alt={viewsLabel} width={20} height={20} />
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
    </Link>
  );
}
