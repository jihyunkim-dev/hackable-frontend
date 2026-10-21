import Image from "next/image";
import Link from "next/link";
import { commonIconUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";
import {
  buildPageHref,
  getPageItems,
  type PaginationState,
} from "@/utils/pagination";

interface PaginationProps extends PaginationState {
  basePath: string;
  // 페이지를 옮겨도 유지할 다른 검색 조건 (예: { type: "project" })
  query?: Record<string, string | undefined>;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query,
  className,
}: PaginationProps) {
  const href = (page: number) => buildPageHref(basePath, page, query);
  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="페이지 이동"
      className={cn("flex items-center justify-center gap-2 py-16", className)}
    >
      <PageArrow
        direction="prev"
        href={currentPage > 1 ? href(currentPage - 1) : undefined}
      />

      <ul className="flex items-center gap-3">
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden
              className="flex size-7 items-center justify-center"
            >
              <Image
                src={commonIconUrl.ellipsis}
                alt=""
                width={10}
                height={2}
              />
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg text-label-l transition-colors",
                  item === currentPage
                    ? "bg-primary-500 text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      <PageArrow
        direction="next"
        href={currentPage < totalPages ? href(currentPage + 1) : undefined}
      />
    </nav>
  );
}

function PageArrow({
  direction,
  href,
}: {
  direction: "prev" | "next";
  href?: string;
}) {
  const label = direction === "prev" ? "이전 페이지" : "다음 페이지";
  const icon = (
    <Image
      src={commonIconUrl.prev}
      alt=""
      width={32}
      height={32}
      className={cn("size-8", direction === "next" && "rotate-180")}
    />
  );

  if (!href) {
    return (
      <span aria-disabled className="opacity-40" aria-label={label}>
        {icon}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label}>
      {icon}
    </Link>
  );
}
