"use client";

import { useActiveHeading } from "@/hooks/useActiveHeading";
import { cn } from "@/lib/utils";

// 클립 본문 목차. 현재 읽고 있는 제목을 강조한다.
export default function ClipToc({
  label,
  headings,
}: {
  label: string;
  headings: { id: string; text: string }[];
}) {
  const activeId = useActiveHeading(headings.map((heading) => heading.id));

  return (
    <nav
      aria-label={label}
      className="rounded-[18px] border border-gray-200 p-3"
    >
      <ol className="flex flex-col gap-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={heading.id === activeId ? "location" : undefined}
              className={cn(
                "block text-label-s font-bold transition-colors",
                heading.id === activeId
                  ? "text-primary-400"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
