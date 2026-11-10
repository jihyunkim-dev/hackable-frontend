import Image from "next/image";
import Link from "next/link";
import { newsletterArchiveContent } from "@/configs/contents/newsletter";
import { cn } from "@/lib/utils";
import type {
  NewsletterEntryView,
  NewsletterIssueView as NewsletterIssue,
  NewsletterPartView,
  NewsletterTone,
} from "@/utils/newsletterArchive";

const content = newsletterArchiveContent.issue;

// 남은 날에 따른 색. 메일과 같은 값을 쓴다. (빨강: 3일 이내, 주황: 7일 이내)
const TONE_STYLE: Record<
  NewsletterTone,
  { card: string; text: string; badge: string }
> = {
  urgent: {
    card: "border-l-[#e53935] bg-[#ffebeb]",
    text: "text-[#e53935]",
    badge: "bg-[#e53935]",
  },
  soon: {
    card: "border-l-[#f57c00] bg-[#fff3e6]",
    text: "text-[#f57c00]",
    badge: "bg-[#f57c00]",
  },
  normal: {
    card: "border-l-gray-300 bg-white",
    text: "text-gray-600",
    badge: "bg-gray-500",
  },
};

// 지난 뉴스레터 한 호. 발송 메일(600px 카드)과 같은 모양으로 보여 준다.
// 머리(호수·이번 주 마감 수·파트 바로가기) → 파트별 PICK 카드 + 마감 가까운 순 목록 → 안내 문구
export default function NewsletterIssueView({
  issue,
}: {
  issue: NewsletterIssue;
}) {
  return (
    <article className="mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl bg-white">
      <IssueHeader issue={issue} />
      {issue.parts.map((part, index) => (
        <IssuePart key={part.key} part={part} index={index} />
      ))}
      <footer className="mt-10 border-t border-gray-100 px-5 pt-6 pb-8 text-[12px] leading-[18px] text-gray-500 sm:px-8">
        <p>{content.notice}</p>
        <p className="mt-2">{content.schedule}</p>
      </footer>
    </article>
  );
}

function IssueHeader({ issue }: { issue: NewsletterIssue }) {
  return (
    <header className="bg-[#7f47aa] bg-[linear-gradient(135deg,#974ea8_0%,#bd5d9d_42%,#c37ebd_62%,#7586d8_100%)] px-5 pt-6 pb-9 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <Image
          src="/images/logo.svg"
          alt="Hackable"
          width={106}
          height={20}
          className="h-5 w-auto brightness-0 invert"
        />
        <p className="text-[12px] leading-[18px] text-primary-50">
          {content.weekly(issue.number, issue.publishedLabel)}
        </p>
      </div>
      <h1 className="mt-10 text-[32px] leading-[43px] font-extrabold tracking-[-0.03em] text-white sm:text-[36px] sm:leading-[45px]">
        {content.headline(issue.thisWeek).map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-2.5 text-[16px] leading-[29px] text-primary-50">
        {content.summary(issue.total)}
      </p>
      <nav className="mt-5 flex flex-wrap gap-1.5" aria-label="파트 바로가기">
        {issue.parts.map((part) => (
          <a
            key={part.key}
            href={`#${part.key}`}
            className="rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[12px] leading-[18px] font-bold text-white"
          >
            {part.title} {part.count}
          </a>
        ))}
      </nav>
    </header>
  );
}

function IssuePart({
  part,
  index,
}: {
  part: NewsletterPartView;
  index: number;
}) {
  return (
    <section
      id={part.key}
      className="scroll-mt-(--header-height-mobile) px-5 pt-11 sm:px-7 md:scroll-mt-(--header-height-desktop)"
    >
      <p className="text-[12px] leading-[18px] font-bold tracking-[0.08em] text-primary-500">
        {content.partLabel(index)}
      </p>
      <h2 className="mt-1 text-[24px] leading-[34px] font-bold text-gray-900">
        {part.title} <span className="text-primary-500">{part.count}</span>
      </h2>
      <p className="mt-0.5 text-[14px] leading-[22px] text-gray-600">
        {part.about}
        {content.listedSuffix(part.listedCount)}
      </p>

      <PickCard part={part} />

      <ul className="mt-3 flex flex-col gap-2">
        {part.items.map((item, itemIndex) => (
          <li key={`${itemIndex}-${item.href}`}>
            <EntryRow entry={item} />
          </li>
        ))}
      </ul>

      <div className="mt-2 text-center">
        <Link
          href={part.moreHref}
          className="text-[14px] leading-[22px] font-bold text-primary-600"
        >
          {content.more}
        </Link>
      </div>
    </section>
  );
}

// PICK: 상금이 가장 큰 공고(대회) 또는 가장 먼저 마감되는 공고(지원사업)
function PickCard({ part }: { part: NewsletterPartView }) {
  const { pick, pickKind } = part;
  const tone = TONE_STYLE[pick.tone];

  return (
    <div className="mt-4 rounded-2xl bg-primary-50 p-3.5">
      <p className="mb-2.5 ml-1 text-[12px] leading-[18px] font-bold text-primary-600">
        {content.pickLabel[pickKind]}
      </p>
      <div className="flex rounded-2xl border border-primary-100 bg-white">
        {/* 상금이 길어져도(3,000만원) 오른쪽 제목과 겹치지 않게 너비를 고정하지 않는다. (최소 100px, 제목과 16px 간격) */}
        <div className="min-w-[100px] shrink-0 py-5 pr-1 pl-5 whitespace-nowrap">
          <p className="text-[12px] leading-[18px] font-bold text-gray-600">
            {pickKind === "prize" ? content.prizeLabel : content.deadlineLabel}
          </p>
          {pickKind === "prize" ? (
            <p className="text-[24px] leading-[34px] font-extrabold text-primary-500">
              {pick.prizeAmount}
              <span className="text-[14px]">{content.prizeUnit}</span>
            </p>
          ) : (
            <p
              className={cn(
                "text-[24px] leading-[34px] font-extrabold",
                tone.text,
              )}
            >
              {pick.dDay}
            </p>
          )}
        </div>
        <div className="min-w-0 flex-1 py-5 pr-5 pl-3">
          <span
            className={cn(
              "inline-block rounded-md px-1.5 py-0.5 text-[12px] leading-[18px] font-bold text-white",
              tone.badge,
            )}
          >
            {pick.dDay}
          </span>
          <span className="ml-1 text-[12px] leading-[18px] text-gray-600">
            {pick.deadline} {content.deadlineSuffix}
            {pick.tag && ` · ${pick.tag}`}
          </span>
          <p className="mt-2">
            <Link
              href={pick.href}
              className="text-[18px] leading-[26px] font-extrabold text-gray-900"
            >
              {pick.title}
            </Link>
          </p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-gray-600">
            {pick.host}
          </p>
          <Link
            href={pick.href}
            className="mt-3 inline-block rounded-[10px] bg-primary-500 px-4 py-2 text-[14px] leading-[22px] font-bold text-white"
          >
            {content.pickLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

// 목록 한 줄: 제목(+분류) / 주최 · 마감일 · 상금 | 오른쪽 D-day
function EntryRow({ entry }: { entry: NewsletterEntryView }) {
  const tone = TONE_STYLE[entry.tone];

  return (
    <div
      className={cn(
        "relative flex rounded-[10px] border border-l-4 border-gray-100",
        tone.card,
      )}
    >
      <div className="min-w-0 flex-1 px-3.5 py-3">
        <Link
          href={entry.href}
          className="text-[16px] leading-[24px] font-bold text-gray-900 after:absolute after:inset-0"
        >
          {entry.title}
        </Link>
        {entry.tag && (
          <span className="ml-1.5 rounded bg-primary-50 px-1.5 text-[12px] leading-[18px] font-bold text-primary-600">
            {entry.tag}
          </span>
        )}
        <p className="mt-0.5 text-[12px] leading-[18px] text-gray-600">
          {[entry.host, entry.deadline].filter(Boolean).join(" · ")}
          {entry.prize && (
            <>
              {" · "}
              <b className="text-primary-500">{entry.prize}</b>
            </>
          )}
        </p>
      </div>
      <p
        className={cn(
          "min-w-14 shrink-0 pt-3 pr-3.5 text-right text-[14px] leading-[22px] font-extrabold whitespace-nowrap",
          tone.text,
        )}
      >
        {entry.dDay}
      </p>
    </div>
  );
}
