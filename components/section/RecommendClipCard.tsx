import Image from "next/image";
import Link from "next/link";
import { commonIconUrl } from "@/configs/urls";

export interface RecommendClipItem {
  id: string;
  tags: string[];
  title: string;
  readTime: string;
  createdAt: string;
  thumbnail: string;
  href: string;
}

// 클립 상세 하단 추천 카드 (세로형)
export default function RecommendClipCard({
  item,
}: {
  item: RecommendClipItem;
}) {
  return (
    <Link href={item.href} className="group flex flex-col gap-2.5 p-2.5">
      <div className="relative aspect-[300/173] overflow-hidden rounded-lg bg-black">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          sizes="300px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <p className="flex flex-wrap items-center gap-2 text-label-m text-gray-600">
        {item.tags.map((tag, index) => (
          <span key={tag} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden className="h-2.5 w-px bg-gray-300" />
            )}
            {tag}
          </span>
        ))}
      </p>
      <h3 className="line-clamp-2 min-h-[56px] text-heading-xs text-gray-700">
        {item.title}
      </h3>
      <p className="flex items-center justify-end gap-1 text-label-s text-gray-500">
        {item.readTime && (
          <>
            <Image
              src={commonIconUrl.clockPurple}
              alt=""
              width={16}
              height={16}
            />
            {item.readTime}
            <span aria-hidden>∙</span>
          </>
        )}
        <time>{item.createdAt}</time>
      </p>
    </Link>
  );
}
