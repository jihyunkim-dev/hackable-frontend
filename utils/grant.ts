// API 지원사업 응답을 화면용 데이터로 바꾼다. (카드·상세 화면은 프로젝트와 같은 컴포넌트를 쓴다)
import { cacheLife, cacheTag } from "next/cache";
import type { ProjectItem } from "@/components/section/ProjectCard";
import type { ProjectDetail } from "@/components/section/ProjectDetailSection";
import { projectContent } from "@/configs/contents/project";
import { isAllowedImageUrl } from "@/configs/imageHosts";
import { hostLogoBaseUrl, placeholderImageUrl } from "@/configs/urls";
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
// 기관 로고가 새로 올라오면 revalidateTag("host-logos")로 확인 결과를 지운다.
const HOST_LOGO_CACHE_TAG = "host-logos";

const toHostLogoUrl = (hosted: string) =>
  `${encodeURI(hostLogoBaseUrl)}/${encodeURIComponent(hosted)}.jpg`;

// 주최 기관 로고가 CDN에 있으면 주소를, 없으면 null을 돌려준다. 기관별로 하루 캐시한다.
async function findHostLogo(hosted: string | null): Promise<string | null> {
  "use cache";
  cacheLife("days");
  cacheTag(HOST_LOGO_CACHE_TAG);

  if (!hosted) return null;
  const url = toHostLogoUrl(hosted);
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok ? url : null;
  } catch {
    return null;
  }
}

// 목록의 기관 로고를 한 번에 찾는다. (같은 기관은 한 번만 확인)
export async function findHostLogos(grants: { hosted: string | null }[]) {
  const hosts = [...new Set(grants.map((grant) => grant.hosted ?? ""))];
  const logos = await Promise.all(hosts.map((hosted) => findHostLogo(hosted)));
  const byHost = new Map(hosts.map((hosted, index) => [hosted, logos[index]]));
  return (hosted: string | null) => byHost.get(hosted ?? "") ?? null;
}

// 상세 경로: /startup-support/27518-2-cha-jeonju...
// 카드·상세 경로에 필요한 필드만 받는다. (목록 응답과 검색 결과를 같이 쓴다)
type GrantCardSource = Pick<
  GrantListItemResponse,
  "grant_id" | "title" | "end_date" | "thumbnail_img" | "seo_url" | "hosted"
> & { prize?: string | null };

export function getGrantHref(
  grant: Pick<GrantCardSource, "grant_id" | "seo_url">,
): string {
  return `${projectContent.startupSupport.href}/${grant.seo_url ?? grant.grant_id}`;
}

// 썸네일 우선순위: 공고 썸네일 → 주최 기관 로고 → 없음("이미지 준비중")
export function toGrantItem(
  grant: GrantCardSource,
  now: number,
  hostLogo: string | null = null,
): ProjectItem {
  return {
    id: String(grant.grant_id),
    title: grant.title,
    thumbnail: isAllowedImageUrl(grant.thumbnail_img)
      ? grant.thumbnail_img
      : hostLogo,
    dDay: formatDDay(grant.end_date, now),
    prizeLabel: "지원규모",
    prize: grant.prize ?? "미정",
    href: getGrantHref(grant),
    bookmarkType: "grant",
  };
}

export function toGrantDetail(
  grant: GrantDetailResponse,
  now: number,
  hostLogo: string | null = null,
): ProjectDetail {
  const hasThumbnail = isAllowedImageUrl(grant.thumbnail_img);

  return {
    id: String(grant.grant_id),
    title: grant.title,
    host: grant.hosted ?? "",
    period: formatPeriod(grant.start_date, grant.end_date),
    dDay: formatDDay(grant.end_date, now),
    views: grant.view_count,
    thumbnail: isAllowedImageUrl(grant.thumbnail_img)
      ? grant.thumbnail_img
      : (hostLogo ?? placeholderImageUrl.thumbnail),
    // 기관 로고는 잘리지 않게 통째로 보여준다.
    thumbnailFit: !hasThumbnail && hostLogo ? "contain" : "cover",
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
    const documents = (result?.hits ?? []).map((hit) => hit.document);
    const hostLogoOf = await findHostLogos(documents);
    const now = Date.now();
    return {
      items: documents.map((document) =>
        // 검색 결과는 id가 문자열로 온다.
        toGrantItem(
          { ...document, grant_id: Number(document.id) },
          now,
          hostLogoOf(document.hosted),
        ),
      ),
      pagination: getPagination(result?.found ?? 0, page, PAGE_SIZE.project),
    };
  }

  const data = await RequestGrantList({
    skip: toSkip(page, PAGE_SIZE.project),
    limit: PAGE_SIZE.project,
    sort,
  });
  const grants = data?.items ?? [];
  const hostLogoOf = await findHostLogos(grants);
  const now = Date.now();

  return {
    items: grants.map((grant) =>
      toGrantItem(grant, now, hostLogoOf(grant.hosted)),
    ),
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
  if (!data) return null;
  const hostLogo = await findHostLogo(data.hosted);
  return toGrantDetail(data, Date.now(), hostLogo);
}
