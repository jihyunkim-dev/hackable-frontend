// API 클립 응답을 화면용 데이터로 바꾼다.
import { cacheLife, cacheTag } from "next/cache";
import type { ClipItem } from "@/components/section/ClipCard";
import type { ClipDetail } from "@/components/section/ClipDetailSection";
import type { FeaturedClip } from "@/components/section/ClipFeaturedCarousel";
import type { RecommendClipItem } from "@/components/section/RecommendClipCard";
import type { WeeklyClipItem } from "@/components/section/WeeklyClipList";
import { clipContent } from "@/configs/contents/clip";
import { isAllowedImageUrl } from "@/configs/imageHosts";
import { placeholderImageUrl } from "@/configs/urls";
import { PAGE_SIZE, toSkip } from "@/utils/pagination";
import { renderMarkdown } from "@/utils/markdown";
import { formatDate, parseSlugId } from "@/utils/project";
import {
  RequestClipCarousel,
  RequestClipDetail,
  RequestClipList,
  type ClipResponse,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 새 데이터가 들어오면 revalidateTag("clips")로 이 캐시만 지운다.
const CACHE_TAG = "clips";

const RECOMMEND_COUNT = 3;
const WEEKLY_COUNT = 5;

// 썸네일이 없거나("" 포함) 허용하지 않은 주소면 "이미지 준비중" 이미지
const toThumbnail = (clip: ClipResponse) =>
  isAllowedImageUrl(clip.thumbnail_img)
    ? clip.thumbnail_img
    : placeholderImageUrl.thumbnail;

// TODO: duration 단위 확인 필요 (분으로 가정). 값이 없으면 빈 문자열이고, 화면에서 시간 표시를 숨긴다.
const toReadTime = (clip: ClipResponse) =>
  clip.duration ? `${clip.duration}분` : "";

// API 카테고리 값(tech, pmd 등)을 화면 이름(AI・개발 등)으로 바꾼다. 없거나 모르는 값이면 빈 문자열
const toCategoryLabel = (clip: ClipResponse) =>
  clipContent.categories.find(
    (category) => category.value !== "all" && category.value === clip.category,
  )?.label ?? "";

const toHref = (clip: ClipResponse) => `/clip/${clip.id}`;

export function toClipItem(clip: ClipResponse): ClipItem {
  return {
    id: String(clip.id),
    category: toCategoryLabel(clip),
    title: clip.title,
    description: clip.description ?? "",
    readTime: toReadTime(clip),
    createdAt: formatDate(clip.created_at),
    thumbnail: toThumbnail(clip),
    href: toHref(clip),
  };
}

const toFeaturedClip = (clip: ClipResponse): FeaturedClip => ({
  id: String(clip.id),
  category: toCategoryLabel(clip),
  title: [clip.title],
  image: toThumbnail(clip),
  href: toHref(clip),
});

const toWeeklyClip = (clip: ClipResponse): WeeklyClipItem => ({
  id: String(clip.id),
  title: clip.title,
  category: toCategoryLabel(clip),
  readTime: toReadTime(clip),
  createdAt: formatDate(clip.created_at),
  thumbnail: toThumbnail(clip),
  href: toHref(clip),
});

const toRecommendClip = (clip: ClipResponse): RecommendClipItem => ({
  id: String(clip.id),
  tags: clip.tags,
  title: clip.title,
  readTime: toReadTime(clip),
  createdAt: formatDate(clip.created_at),
  thumbnail: toThumbnail(clip),
  href: toHref(clip),
});

// 본문(description)은 마크다운 문자열이다. HTML로 변환하고 ## 제목으로 목차를 만든다.
function toClipDetail(clip: ClipResponse): ClipDetail {
  const body = clip.description ? renderMarkdown(clip.description) : null;

  return {
    id: String(clip.id),
    category: toCategoryLabel(clip),
    title: clip.title,
    readTime: toReadTime(clip),
    createdAt: formatDate(clip.created_at),
    views: clip.view_count,
    bookmarks: clip.bookmark_count,
    blocks: body ? [{ type: "html", html: body.html }] : [],
    headings: body?.headings ?? [],
  };
}

// "10월 4주차 인기클립" (한국 날짜 기준, 7일 단위 주차)
function getWeeklyTitle(now: number) {
  const kst = new Date(now + 9 * 60 * 60 * 1000);
  const week = Math.ceil(kst.getUTCDate() / 7);
  return `${kst.getUTCMonth() + 1}월 ${week}주차 인기클립`;
}

// 목록 페이지를 1시간 캐시한다. category는 API 값(tech, vibeCoding, pmd, trend)
// API가 전체 개수를 주지 않아 한 개 더 요청해서 다음 페이지가 있는지만 판단한다.
export async function getClipPage(page: number, category?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const pageSize = PAGE_SIZE.clip;
  const data = await RequestClipList({
    skip: toSkip(page, pageSize),
    limit: pageSize + 1,
    category,
  });
  const clips = data ?? [];
  const hasNext = clips.length > pageSize;

  return {
    items: clips.slice(0, pageSize).map(toClipItem),
    // TODO: API에 total_count가 생기면 getPagination으로 교체
    pagination: { currentPage: page, totalPages: hasNext ? page + 1 : page },
  };
}

// 추천 캐러셀 + 인기 클립 (클립 목록 상단)
export async function getClipHighlights() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const [carousel, popular] = await Promise.all([
    RequestClipCarousel(),
    // TODO: 인기순 API가 없어(클립 정렬은 latest만 지원) 최신 클립으로 대신한다.
    RequestClipList({ limit: WEEKLY_COUNT }),
  ]);

  return {
    featured: (carousel ?? []).map(toFeaturedClip),
    weekly: {
      title: getWeeklyTitle(Date.now()),
      items: (popular ?? []).map(toWeeklyClip),
    },
  };
}

// 상세 + 추천 클립(최신 클립 중 현재 글 제외)을 1시간 캐시한다.
export async function getClipDetail(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const id = parseSlugId(slug);
  if (!id) return null;

  const [clip, latest] = await Promise.all([
    RequestClipDetail(id),
    RequestClipList({ limit: RECOMMEND_COUNT + 1 }),
  ]);
  if (!clip) return null;

  return {
    detail: toClipDetail(clip),
    recommends: (latest ?? [])
      .filter((item) => item.id !== clip.id)
      .slice(0, RECOMMEND_COUNT)
      .map(toRecommendClip),
  };
}
