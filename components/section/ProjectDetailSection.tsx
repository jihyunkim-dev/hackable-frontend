import Image from "next/image";
import Button from "@/components/ui/Button";
import { projectDetailContent } from "@/configs/contents/projectDetail";

export interface ProjectDetail {
  id: string;
  title: string;
  host: string;
  period: string;
  dDay: string;
  views: number;
  thumbnail: string;
  body: string;
  applyUrl: string;
}

// 해커톤·공모전·창업경진대회 상세 공통 영역
// lg 미만: 포스터 → 요약 → 본문 / lg 이상: 본문 + 오른쪽 고정 요약 카드
export default function ProjectDetailSection({ detail }: { detail: ProjectDetail }) {
  const { periodLabel, viewsLabel, dDayLabel, applyLabel } = projectDetailContent;

  return (
    <section className="mx-auto w-full max-w-[1440px] lg:flex lg:items-start lg:px-15">
      <div className="relative aspect-[2/1] w-full overflow-hidden lg:hidden">
        <Image
          src={detail.thumbnail}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <article className="min-w-0 flex-1 lg:pt-3 lg:pl-8">
        <header className="flex flex-col gap-2 px-4 py-2 lg:gap-2.5 lg:p-2.5">
          <h1 className="text-heading-s text-gray-800 lg:font-bold">
            {detail.title}
          </h1>
          <p className="flex flex-col text-label-l text-gray-600 lg:flex-row lg:gap-2">
            <span>{detail.host}</span>
            <span aria-hidden className="hidden lg:inline">
              |
            </span>
            <span className="text-gray-500 lg:text-gray-600">
              {detail.period}
              <span className="lg:hidden"> ({detail.dDay})</span>
            </span>
          </p>
        </header>

        <div className="flex flex-col gap-2 px-4 py-2 lg:p-2.5">
          <p className="text-label-l text-gray-800 lg:hidden">
            {periodLabel}: {detail.period}
          </p>
          <div className="text-body-l whitespace-pre-line text-gray-800">
            {detail.body}
          </div>
        </div>
      </article>

      {/* lg 이상: 스크롤을 따라오는 요약 카드 */}
      <aside className="sticky top-[calc(var(--header-height-desktop)+12px)] hidden w-[456px] shrink-0 p-3 lg:block">
        <div className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-md">
          <div className="relative h-[215px] overflow-hidden rounded-xl">
            <Image
              src={detail.thumbnail}
              alt=""
              fill
              sizes="392px"
              className="object-cover object-top"
            />
          </div>
          <p className="line-clamp-2 px-2 text-heading-s text-gray-700">
            {detail.title}
          </p>
          <dl className="grid grid-cols-2 gap-2 p-2">
            <Stat label={viewsLabel} value={detail.views.toLocaleString()} />
            <Stat label={dDayLabel} value={detail.dDay} />
          </dl>
          <Button
            asChild
            className="h-10 bg-primary-600 text-heading-xs hover:bg-primary-700"
          >
            <a href={detail.applyUrl} target="_blank" rel="noopener noreferrer">
              {applyLabel}
            </a>
          </Button>
        </div>
      </aside>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-sm bg-primary-50 p-3">
      <dt className="text-label-m text-gray-700">{label}</dt>
      <dd className="text-heading-xs text-primary-700">{value}</dd>
    </div>
  );
}
