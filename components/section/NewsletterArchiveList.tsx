import Link from "next/link";
import { newsletterArchiveContent } from "@/configs/contents/newsletter";
import type { NewsletterArchiveListItem } from "@/utils/newsletterArchive";

// 지난 뉴스레터 목록 (구독 페이지 아래). 한 줄: 호수 · 제목 · 발송일
// 누르면 그 호의 상세(/newsletter/archive/{호수})로 간다.
export default function NewsletterArchiveList({
  items,
}: {
  items: NewsletterArchiveListItem[];
}) {
  const content = newsletterArchiveContent;

  return (
    <section
      id="archive"
      className="mx-auto w-full max-w-[860px] scroll-mt-(--header-height-mobile) px-4 py-12 md:scroll-mt-(--header-height-desktop) lg:py-16"
    >
      <div className="flex flex-col gap-1.5 px-1 pb-5">
        <p className="text-label-l font-semibold text-primary-600">
          {content.eyebrow}
        </p>
        <h2 className="text-heading-s font-bold text-gray-800">
          {content.title}
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="border-t border-gray-300 py-16 text-center text-body-m text-gray-500">
          {content.empty}
        </p>
      ) : (
        <ul aria-label={content.listLabel} className="border-t border-gray-300">
          {items.map((item) => (
            <li key={item.issue} className="border-b border-gray-200">
              <Link
                href={item.href}
                className="flex items-center gap-3 px-2 py-4 transition-colors hover:bg-gray-50 sm:gap-6 sm:px-4"
              >
                <span className="shrink-0 text-label-m font-semibold text-primary-500">
                  {item.label}
                </span>
                <span className="min-w-0 flex-1 truncate text-body-m text-gray-800">
                  {item.title}
                </span>
                <time
                  dateTime={item.date.replaceAll(".", "-")}
                  className="shrink-0 text-label-m font-medium text-gray-500"
                >
                  {item.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
