import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  label: string;
  items: { label: string; href: string }[];
  activeHref: string;
  description?: string;
  className?: string;
}

// 목록 상단의 텍스트형 카테고리 이동 (전체 / 해커톤 / ...)
export default function CategoryNav({
  label,
  items,
  activeHref,
  description,
  className,
}: CategoryNavProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3", className)}>
      <nav aria-label={label}>
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 lg:gap-x-3">
          {items.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-heading-s transition-colors",
                    isActive
                      ? "text-gray-800"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {description && (
        <p className="text-body-l text-gray-600">{description}</p>
      )}
    </div>
  );
}
