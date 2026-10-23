import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  label: string;
  items: { label: string; href: string }[];
  activeHref: string;
  className?: string;
}

// 가로 스크롤되는 pill형 카테고리 이동
export default function CategoryPills({
  label,
  items,
  activeHref,
  className,
}: CategoryPillsProps) {
  return (
    <nav aria-label={label} className={cn("relative", className)}>
      <ul className="scrollbar-hidden flex gap-2.5 overflow-x-auto p-2.5">
        {items.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-lg py-1 text-label-l px-4 font-bold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary-500 text-gray-50"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {/* 오른쪽 끝을 흐리게 해 가로 스크롤이 가능함을 알린다. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white sm:hidden"
      />
    </nav>
  );
}
