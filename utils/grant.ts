// API 지원사업 응답을 화면용 데이터로 바꾼다. (카드·상세 화면은 프로젝트와 같은 컴포넌트를 쓴다)
import { cacheLife } from "next/cache";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import { projectContent } from "@/configs/contents/project";
import { placeholderImageUrl } from "@/configs/urls";
import { getPagination, PAGE_SIZE, toSkip } from "@/utils/pagination";
import {
  formatDDay,
  formatPeriod,
  parseSlugId,
  sanitizeBody,
} from "@/utils/project";
import {
  RequestGrantDetail,
  RequestGrantList,
  type GrantDetailResponse,
  type GrantListItemResponse,
} from "@/utils/requestToSrv";

// 상세 경로: /startup-support/27518-2-cha-jeonju...
export function getGrantHref(grant: GrantListItemResponse): string {
  return `${projectContent.startupSupport.href}/${grant.seo_url ?? grant.grant_id}`;
}

export function toGrantItem(
  grant: GrantListItemResponse,
  now: number,
): ProjectItem {
  return {
    id: String(grant.grant_id),
    title: grant.title,
    thumbnail: grant.thumbnail_img || null,
    dDay: formatDDay(grant.end_date, now),
    prizeLabel: "지원규모",
    prize: grant.prize ?? "미정",
    href: getGrantHref(grant),
  };
}

export function toGrantDetail(
  grant: GrantDetailResponse,
  now: number,
): ProjectDetail {
  return {
    id: String(grant.grant_id),
    title: grant.title,
    host: grant.hosted ?? "",
    period: formatPeriod(grant.start_date, grant.end_date),
    dDay: formatDDay(grant.end_date, now),
    views: grant.view_count,
    thumbnail: grant.thumbnail_img || placeholderImageUrl.thumbnail,
    bodyHtml: sanitizeBody(grant.description ?? ""),
    applyUrl: grant.external_url,
    href: getGrantHref(grant),
  };
}

// 페이지별 목록을 1분간 캐시한다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
export async function getGrantPage(page: number) {
  "use cache";
  cacheLife("minutes");

  const data = await RequestGrantList({
    skip: toSkip(page, PAGE_SIZE.project),
    limit: PAGE_SIZE.project,
  });
  const now = Date.now();

  return {
    items: (data?.items ?? []).map((grant) => toGrantItem(grant, now)),
    pagination: getPagination(data?.total_count ?? 0, page, PAGE_SIZE.project),
  };
}

// 상세 데이터를 1분간 캐시한다. (generateMetadata와 화면이 같은 결과를 쓴다)
export async function getGrantDetail(
  slug: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("minutes");

  const id = parseSlugId(slug);
  if (!id) return null;

  const data = await RequestGrantDetail(id);
  return data ? toGrantDetail(data, Date.now()) : null;
}
