import Image from "next/image";
import Link from "next/link";
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
}

interface ProjectCardProps {
  item: ProjectItem;
  // elevated: 흰 배경 + 그림자(메인), plain: 배경 없음(목록)
  variant?: "elevated" | "plain";
  className?: string;
}

// 해커톤·공모전·지원사업 카드. xs는 180px, sm 이상은 300px 카드
export default function ProjectCard({
  item,
  variant = "elevated",
  className,
}: ProjectCardProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-[180px] shrink-0 flex-col gap-2 rounded-xl p-3 transition-shadow sm:w-[300px] sm:p-4",
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
        {/* TODO: 북마크 기능은 API 연동 시 버튼으로 전환 */}
        <Image
          src={commonIconUrl.bookmarkCard}
          alt=""
          width={25}
          height={32}
          className="absolute top-1 right-1 h-7 w-[22px] sm:top-3.5 sm:right-3.5 sm:h-8 sm:w-[25px]"
        />
      </div>

      <h3 className="line-clamp-3 min-h-[76px] text-heading-xs text-gray-800 sm:line-clamp-2 sm:min-h-20">
        {item.title}
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
    </Link>
  );
}
