import Link from "next/link";
import MultiLine from "@/components/ui/MultiLine";
import { newsletterSectionContent } from "@/configs/contents/newsletter";

// 상세 페이지 하단의 뉴스레터 소개. md 이상에서는 좌(소개) / 우(목록) 2단
export default function NewsletterSection() {
  const { eyebrow, title, items, description, note, link } =
    newsletterSectionContent;

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-8 md:flex-row md:items-start md:gap-8 md:px-15 md:py-12">
      <div className="flex flex-col md:flex-1">
        <div className="flex flex-col gap-3 p-2.5">
          <p className="text-label-l text-primary-600">{eyebrow}</p>
          <h2 className="text-heading-m font-extrabold text-gray-800">
            <MultiLine lines={title} />
          </h2>
        </div>

        <div className="order-last flex items-start justify-between gap-2 md:order-none md:justify-start">
          <div className="flex flex-col gap-1 px-3 py-2">
            <p className="text-label-l text-gray-700">{description}</p>
            <p className="text-label-s text-gray-400">{note}</p>
          </div>
          <Link
            href={link.href}
            className="shrink-0 p-2 text-label-l text-gray-800 underline underline-offset-2"
          >
            {link.label}
          </Link>
        </div>
      </div>

      <ol className="grid grid-rows-3 md:w-[45%] md:max-w-[590px] md:self-stretch">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-center gap-2 px-3 py-2 text-label-l text-gray-700"
          >
            <span className="w-9 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
