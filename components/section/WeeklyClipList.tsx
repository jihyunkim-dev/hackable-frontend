import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface WeeklyClipItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  createdAt: string;
  thumbnail: string;
  href: string;
}

// 주간 인기 클립 목록
export default function WeeklyClipList({
  title,
  items,
  className,
}: {
  title: string;
  items: WeeklyClipItem[];
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-2 lg:gap-3", className)}>
      <h2 className="px-4 py-2 text-heading-xs font-bold text-primary-500 lg:px-0 lg:py-0">
        {title}
      </h2>
      <ul className="flex flex-col gap-5 px-4 py-2 lg:gap-7 lg:p-0 xl:gap-12">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 p-2 lg:p-0"
            >
              <div className="relative size-28 shrink-0 overflow-hidden rounded-lg lg:size-25">
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="line-clamp-2 text-label-l font-bold text-gray-800">
                  {item.title}
                </h3>
                {/* 카테고리·읽는 시간·날짜 중 값이 있는 것만 구분선으로 잇는다. */}
                <p className="flex items-center gap-1 text-label-m font-bold text-gray-600">
                  {[item.category, item.readTime, item.createdAt]
                    .filter(Boolean)
                    .map((value, index) => (
                      <Fragment key={value}>
                        {index > 0 && (
                          <span aria-hidden className="text-gray-300">
                            |
                          </span>
                        )}
                        <span>{value}</span>
                      </Fragment>
                    ))}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
