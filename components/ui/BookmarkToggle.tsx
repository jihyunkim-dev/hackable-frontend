"use client";

import Image from "next/image";
import { type BookmarkType, useBookmark } from "@/hooks/useBookmark";
import { cn } from "@/lib/utils";

interface BookmarkIcon {
  src: string;
  width: number;
  height: number;
}

interface BookmarkToggleProps {
  type: BookmarkType;
  id: string;
  label: string;
  // off: 북마크 전, on: 북마크한 상태
  icons: { off: BookmarkIcon; on: BookmarkIcon };
  // 넘기면 아이콘 옆에 북마크 수를 보여준다. (상세 페이지)
  count?: number;
  className?: string;
  iconClassName?: string;
}

// 카드·상세 공용 북마크 버튼. 카드 링크 위에 올라가도록 relative z-10을 준다.
export default function BookmarkToggle({
  type,
  id,
  label,
  icons,
  count,
  className,
  iconClassName,
}: BookmarkToggleProps) {
  const bookmark = useBookmark(type, id, count);
  const icon = bookmark.bookmarked ? icons.on : icons.off;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={bookmark.bookmarked}
      disabled={bookmark.isPending}
      onClick={bookmark.toggle}
      className={cn(
        "relative z-10 flex items-center justify-center",
        className,
      )}
    >
      <Image
        src={icon.src}
        alt=""
        width={icon.width}
        height={icon.height}
        className={iconClassName}
      />
      {/* 카드에는 수를 보여주지 않는다. count를 넘긴 곳(상세)만 표시 */}
      {count !== undefined && bookmark.count}
    </button>
  );
}
