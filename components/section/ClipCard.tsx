import Image from "next/image";
import Link from "next/link";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

export interface ClipItem {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  createdAt: string;
  thumbnail: string;
  href: string;
}

interface ClipCardProps {
  item: ClipItem;
  className?: string;
}

export default function ClipCard({ item, className }: ClipCardProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex gap-2 rounded-xl bg-white p-2 shadow-sm transition-colors sm:gap-5 sm:bg-gray-50 sm:p-5 sm:shadow-none sm:hover:bg-gray-100",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col sm:gap-2">
        {item.category && (
          <p className="py-1 text-label-s text-gray-600 sm:py-0 sm:text-label-l">
            {item.category}
          </p>
        )}
        <h3 className="line-clamp-2 text-label-m font-bold text-gray-800 sm:text-heading-s sm:font-bold">
          {item.title}
        </h3>
        <p className="hidden text-body-m font-medium text-ellipsis text-gray-500 sm:line-clamp-3">
          {item.description}
        </p>
        <p className="mt-auto flex items-center gap-1 pt-2 text-label-s text-gray-600 sm:gap-2 sm:text-label-m sm:font-bold">
          {/* 읽는 시간이 없으면 시계 아이콘과 구분선을 함께 숨긴다. */}
          {item.readTime && (
            <>
              <span className="flex items-center gap-1">
                <Image
                  src={commonIconUrl.clock}
                  alt=""
                  width={20}
                  height={20}
                  className="size-3.5 sm:size-5"
                />
                {item.readTime}
              </span>
              <span aria-hidden className="px-0.5 text-gray-400">
                |
              </span>
            </>
          )}
          <time>{item.createdAt}</time>
        </p>
      </div>

      {/* 배경은 "이미지 준비중" 이미지와 같은 색(primary-50). 썸네일은 잘리더라도 칸을 꽉 채운다. */}
      <div className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-primary-50 sm:h-60 sm:w-70 sm:rounded-[20px]">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          sizes="(min-width: 768px) 280px, 112px"
          className="object-cover"
        />
        {/* TODO: 북마크 기능은 API 연동 시 버튼으로 전환 */}
        <Image
          src={commonIconUrl.bookmarkClip}
          alt=""
          width={28}
          height={28}
          className="absolute top-[7px] right-[5px] size-[18px] sm:top-3 sm:right-[11px] sm:size-7"
        />
      </div>
    </Link>
  );
}
