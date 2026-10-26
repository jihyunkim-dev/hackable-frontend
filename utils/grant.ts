// API 지원사업 응답을 화면용 데이터로 바꾼다. (카드·상세 화면은 프로젝트와 같은 컴포넌트를 쓴다)
import { cacheLife, cacheTag } from "next/cache";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import { projectContent } from "@/configs/contents/project";
import { isAllowedImageUrl } from "@/configs/imageHosts";
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
  RequestSearchGrants,
  type ListSort,
  type GrantDetailResponse,
  type GrantListItemResponse,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 새 데이터가 들어오면 revalidateTag("grants")로 이 캐시만 지운다.
const CACHE_TAG = "grants";

// 상세 경로: /startup-support/27518-2-cha-jeonju...
// 카드·상세 경로에 필요한 필드만 받는다. (목록 응답과 검색 결과를 같이 쓴다)
type GrantCardSource = Pick<
  GrantListItemResponse,
  "grant_id" | "title" | "end_date" | "thumbnail_img" | "seo_url"
> & { prize?: string | null };

export function getGrantHref(
  grant: Pick<GrantCardSource, "grant_id" | "seo_url">,
): string {
  return `${projectContent.startupSupport.href}/${grant.seo_url ?? grant.grant_id}`;
}

export function toGrantItem(
  grant: GrantCardSource,
  now: number,
): ProjectItem {
  return {
    id: String(grant.grant_id),
    title: grant.title,
    thumbnail: isAllowedImageUrl(grant.thumbnail_img) ? grant.thumbnail_img : null,
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
    thumbnail: isAllowedImageUrl(grant.thumbnail_img)
      ? grant.thumbnail_img
      : placeholderImageUrl.thumbnail,
    bodyHtml: sanitizeBody(grant.description ?? ""),
    applyUrl: grant.external_url,
    href: getGrantHref(grant),
  };
}

// 페이지별 목록을 1시간 캐시한다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
// 검색어(q)가 있으면 검색 API를 쓴다. 검색은 관련도 순이라 정렬(sort)은 반영되지 않는다.
export async function getGrantPage(
  page: number,
  sort: ListSort = "latest",
  q = "",
) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  if (q) {
    const result = await RequestSearchGrants({
      q,
      page,
      per_page: PAGE_SIZE.project,
    });
    const now = Date.now();
    return {
      items: (result?.hits ?? []).map((hit) =>
        // 검색 결과는 id가 문자열로 온다.
        toGrantItem({ ...hit.document, grant_id: Number(hit.document.id) }, now),
      ),
      pagination: getPagination(result?.found ?? 0, page, PAGE_SIZE.project),
    };
  }

  const data = await RequestGrantList({
    skip: toSkip(page, PAGE_SIZE.project),
    limit: PAGE_SIZE.project,
    sort,
  });
  const now = Date.now();

  return {
    items: (data?.items ?? []).map((grant) => toGrantItem(grant, now)),
    pagination: getPagination(data?.total_count ?? 0, page, PAGE_SIZE.project),
  };
}

// 상세 데이터를 1시간 캐시한다. (generateMetadata와 화면이 같은 결과를 쓴다)
export async function getGrantDetail(
  slug: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAG);

  const id = parseSlugId(slug);
  if (!id) return null;

  const data = await RequestGrantDetail(id);
  return data ? toGrantDetail(data, Date.now()) : null;
}
