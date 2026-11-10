// 지난 뉴스레터(아카이브): 구독 페이지의 목록과 호수별 상세.
// 화면은 발송한 메일(매주 화요일)의 디자인·문구를 그대로 따른다.
import { cacheLife, cacheTag } from "next/cache";
import { siteUrl } from "@/configs/urls";
import { daysUntil, parseKstDate } from "@/utils/project";
import {
  RequestNewsletterArchive,
  RequestNewsletterIssue,
  type NewsletterArchiveItem,
  type NewsletterIssueEntry,
  type NewsletterIssueResponse,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 새 호수가 나가면 revalidateTag("newsletter")로 이 캐시만 지운다.
const CACHE_TAG = "newsletter";

export const getNewsletterIssueHref = (issue: string) =>
  `/newsletter/archive/${issue}`;

// 호수 번호: 2026w46 → 46 (메일 머리의 WEEKLY #46)
const toIssueNumber = (issue: string) => issue.match(/w(\d+)$/i)?.[1] ?? issue;

// 호수 이름: 2026w46 → 2026년 46주차 (목록 왼쪽)
const toIssueLabel = (issue: string) => {
  const match = issue.match(/^(\d{4})w(\d+)$/i);
  return match ? `${match[1]}년 ${Number(match[2])}주차` : issue;
};

// ===== 목록 =====

export interface NewsletterArchiveListItem {
  issue: string;
  number: string;
  label: string; // 2026년 46주차
  title: string;
  date: string; // 2026.11.10
  publishedAt: string; // 2026-11-10 (사이트맵 수정일)
  href: string;
}

const toListItem = (
  item: NewsletterArchiveItem,
): NewsletterArchiveListItem => ({
  issue: item.issue,
  number: toIssueNumber(item.issue),
  label: toIssueLabel(item.issue),
  title: item.title,
  date: item.published_at.slice(0, 10).replaceAll("-", "."),
  publishedAt: item.published_at.slice(0, 10),
  href: getNewsletterIssueHref(item.issue),
});

// 최신 호수부터. 1시간 캐시한다.
export async function getNewsletterArchive(): Promise<
  NewsletterArchiveListItem[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const items = await RequestNewsletterArchive();
  // 받지 못했으면(서버 장애) 짧게만 캐시해, 서버가 돌아오면 곧 다시 받는다.
  if (!items) {
    cacheLife("minutes");
    return [];
  }

  return [...items]
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .map(toListItem);
}

// ===== 상세 =====

// 남은 날에 따른 색: 3일 이내 빨강, 7일 이내 주황, 그 뒤는 기본 (메일과 같은 기준)
export type NewsletterTone = "urgent" | "soon" | "normal";

export interface NewsletterEntryView {
  title: string;
  host: string;
  href: string;
  dDay: string; // D-DAY / D-3 / 마감
  tone: NewsletterTone;
  deadline: string; // 11/12(목)
  prize: string | null; // 1,300만원
  prizeAmount: string | null; // 1,300 (PICK 카드의 큰 숫자)
  tag: string | null;
}

export interface NewsletterPartView {
  key: string;
  title: string;
  about: string;
  count: number;
  // 이 호에 실린 수 (PICK 포함). "마감 가까운 순 16개"
  listedCount: number;
  moreHref: string;
  // prize: 상금이 가장 큰 공고 / deadline: 가장 먼저 마감되는 공고 (지원사업처럼 상금이 없을 때)
  pickKind: "prize" | "deadline";
  pick: NewsletterEntryView;
  items: NewsletterEntryView[];
}

export interface NewsletterIssueView {
  issue: string;
  number: string;
  title: string;
  publishedLabel: string; // 11.10
  total: number;
  thisWeek: number;
  parts: NewsletterPartView[];
  href: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 2026-11-12T23:59:00 → 11/12(목)
function formatDeadline(end: string) {
  const day = end.slice(0, 10);
  const [, month, date] = day.split("-").map(Number);
  // 한국 날짜의 정오로 잡아 어느 시간대에서 계산해도 요일이 같다.
  const weekday = new Date(`${day}T12:00:00+09:00`).getUTCDay();
  return `${month}/${date}(${WEEKDAYS[weekday]})`;
}

// 사이트 안 주소는 경로만 남겨 사이트 안에서 이동한다. (메일에는 절대 주소가 들어 있다)
function toSiteHref(url: string) {
  return url.startsWith(siteUrl) ? url.slice(siteUrl.length) || "/" : url;
}

const formatPrize = (prize: number) => `${prize.toLocaleString("ko-KR")}만원`;

// 남은 날은 발송일 기준이다. 지난 호수를 지금 열어도 메일을 받은 날의 D-day로 보인다.
function toEntryView(
  entry: NewsletterIssueEntry,
  publishedAt: number,
): NewsletterEntryView {
  const days = daysUntil(entry.end, publishedAt) ?? 0;
  const tone: NewsletterTone =
    days <= 3 ? "urgent" : days <= 7 ? "soon" : "normal";
  return {
    title: entry.title,
    host: entry.host,
    href: toSiteHref(entry.url),
    dDay: days < 0 ? "마감" : days === 0 ? "D-DAY" : `D-${days}`,
    tone,
    deadline: formatDeadline(entry.end),
    prize: entry.prize ? formatPrize(entry.prize) : null,
    prizeAmount: entry.prize ? entry.prize.toLocaleString("ko-KR") : null,
    tag: entry.tag,
  };
}

function toIssueView(data: NewsletterIssueResponse): NewsletterIssueView {
  const publishedAt = parseKstDate(
    `${data.published_at.slice(0, 10)}T00:00:00`,
  );
  const [, month, day] = data.published_at.slice(0, 10).split("-");

  return {
    issue: data.issue,
    number: toIssueNumber(data.issue),
    title: data.title,
    publishedLabel: `${month}.${day}`,
    total: data.data.total,
    thisWeek: data.data.this_week,
    href: getNewsletterIssueHref(data.issue),
    parts: data.data.parts.map((part) => ({
      key: part.key,
      title: part.title,
      about: part.about,
      count: part.count,
      listedCount: part.items.length + 1,
      moreHref: toSiteHref(part.more),
      pickKind: part.pick.prize ? "prize" : "deadline",
      pick: toEntryView(part.pick, publishedAt),
      items: part.items.map((item) => toEntryView(item, publishedAt)),
    })),
  };
}

// 호수별 상세. 지난 호수는 바뀌지 않아 하루 캐시한다.
export async function getNewsletterIssue(
  issue: string,
): Promise<NewsletterIssueView | null> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAG);

  const data = await RequestNewsletterIssue(issue);
  // 없는 호수이거나 받지 못했으면 짧게만 캐시한다. (서버 장애가 풀리면 곧 다시 받는다)
  if (!data) {
    cacheLife("minutes");
    return null;
  }

  return toIssueView(data);
}

// 상세 페이지 generateStaticParams: 모든 호수를 빌드 때 만든다. (호수가 많아지면 최신 몇 개로 줄인다)
// cacheComponents에서는 하나 이상 돌려줘야 해, 없으면 없는 호수(404)를 넣는다.
export async function getNewsletterIssueStaticParams() {
  const items = await getNewsletterArchive();
  return items.length
    ? items.map((item) => ({ issue: item.issue }))
    : [{ issue: "none" }];
}
