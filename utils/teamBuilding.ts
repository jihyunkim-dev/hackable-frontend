// API 팀빌딩 응답을 화면용 카드 데이터로 바꾼다.
import { cacheLife, cacheTag } from "next/cache";
import { isAllowedImageUrl } from "@/configs/imageHosts";
import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
import type { TeamBuildingDetail } from "@/components/section/TeamBuildingDetailSection";
import { getPagination, PAGE_SIZE, toSkip } from "@/utils/pagination";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import {
  TEAMBUILDING_STATUS_VALUE,
  type TeamBuildingCategory,
} from "@/utils/teamBuildingForm";
import { formatDate, formatDDay, parseSlugId } from "@/utils/project";
import {
  RequestSearchTeambuilding,
  RequestTeambuildingDetail,
  RequestTeambuildingList,
  type ListSort,
  type TeambuildingResponse,
  type TeambuildingSearchDocument,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 글 작성·수정 후 revalidateTag("teambuildings")로 이 캐시만 지운다.
export const TEAMBUILDING_CACHE_TAG = "teambuildings";

// TODO: 모집 상태 값 확정 필요 (현재 "recruiting" 또는 null만 옴). 마감 값이 아니면 모집중으로 본다.
export const TEAMBUILDING_STATUS = TEAMBUILDING_STATUS_VALUE;
const CLOSED_STATUS = TEAMBUILDING_STATUS.closed;

// 카드에 필요한 필드만. (목록 응답과 검색 결과 문서를 같이 받는다)
type TeamBuildingCardSource = Pick<
  TeambuildingResponse,
  | "teambuilding_id"
  | "status"
  | "category"
  | "tags"
  | "title"
  | "end_date"
  | "view_count"
  | "bookmark_count"
>;

// 카테고리 값(project)을 화면 이름(프로젝트)으로. 카테고리 없이 쓴 예전 글은 빈 값
const toCategoryLabel = (value: string | null) =>
  teamBuildingContent.categories.find(
    (category) => category.value !== "all" && category.value === value,
  )?.label ?? "";

export function toTeamBuildingItem(
  post: TeamBuildingCardSource,
  now: number,
): TeamBuildingItem {
  return {
    id: String(post.teambuilding_id),
    isOpen: post.status !== CLOSED_STATUS,
    category: toCategoryLabel(post.category),
    title: post.title,
    dDay: formatDDay(post.end_date, now),
    // TODO: API에 작성자 이름이 없다. (author_id만 옴)
    author: "",
    views: post.view_count,
    bookmarks: post.bookmark_count,
    href: `/teambuilding/${post.teambuilding_id}`,
  };
}

// 검색 결과 문서를 카드용 형태로 맞춘다. (id가 문자열로 오고, 마감일·조회수·북마크 수는 아직 오지 않는다)
const fromSearchDocument = (
  document: TeambuildingSearchDocument,
): TeamBuildingCardSource => ({
  teambuilding_id: Number(document.teambuilding_id),
  status: document.status,
  category: document.category ?? null,
  tags: document.tags,
  title: document.title,
  end_date: document.end_date ?? null,
  view_count: document.view_count ?? 0,
  bookmark_count: document.bookmark_count ?? 0,
});

// 페이지별 목록을 1분간 캐시한다. 사용자가 바로 쓰는 글이라 짧게 둔다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
// category가 없으면(전체) 카테고리를 보내지 않는다.
// 검색어(q)가 있으면 검색 API를 쓴다. 검색은 관련도 순이라 정렬(sort)은 반영되지 않는다.
// TODO: 검색 API에 카테고리 조건이 없어 검색 중에는 카테고리가 반영되지 않는다. (백엔드 추가 요청)
// 목록 API는 전체 개수를 주지 않아 한 개 더 요청해서 다음 페이지가 있는지만 판단한다.
export async function getTeamBuildingPage(
  page: number,
  sort: ListSort = "latest",
  q = "",
  category?: TeamBuildingCategory,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(TEAMBUILDING_CACHE_TAG);

  const pageSize = PAGE_SIZE.teamBuilding;

  if (q) {
    const result = await RequestSearchTeambuilding({
      q,
      page,
      per_page: pageSize,
    });
    const now = Date.now();
    return {
      items: (result?.hits ?? []).map((hit) =>
        toTeamBuildingItem(fromSearchDocument(hit.document), now),
      ),
      pagination: getPagination(result?.found ?? 0, page, pageSize),
    };
  }

  const data = await RequestTeambuildingList({
    skip: toSkip(page, pageSize),
    limit: pageSize + 1,
    sort,
    category,
  });
  const posts = data ?? [];
  const hasNext = posts.length > pageSize;
  const now = Date.now();

  return {
    items: posts
      .slice(0, pageSize)
      .map((post) => toTeamBuildingItem(post, now)),
    // TODO: API에 total_count가 생기면 getPagination으로 교체
    pagination: { currentPage: page, totalPages: hasNext ? page + 1 : page },
  };
}

// 2026-05-15T10:07:55 → 2026.05.15 10:07
const formatDateTime = (value: string) =>
  `${formatDate(value)} ${value.slice(11, 16)}`;

export function toTeamBuildingDetail(
  post: TeambuildingResponse,
): TeamBuildingDetail {
  return {
    id: String(post.teambuilding_id),
    isOpen: post.status !== CLOSED_STATUS,
    title: post.title,
    // TODO: API에 작성자 이름이 없다. (author_id만 옴) 지금은 내가 쓴 글만 내 이름을 보여준다.
    author: "",
    authorId: post.author_id,
    createdAt: formatDateTime(post.created_at),
    views: post.view_count,
    bookmarks: post.bookmark_count,
    body: post.description ?? "",
    position: post.position?.join(", ") ?? "",
    deadline: post.end_date ? formatDate(post.end_date) : "상시",
    image: isAllowedImageUrl(post.thumbnail_img)
      ? post.thumbnail_img
      : undefined,
  };
}

// 상세 데이터를 1분간 캐시한다. (generateMetadata와 화면이 같은 결과를 쓴다)
export async function getTeamBuildingDetail(
  slug: string,
): Promise<TeamBuildingDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TEAMBUILDING_CACHE_TAG);

  const id = parseSlugId(slug);
  if (!id) return null;

  const data = await RequestTeambuildingDetail(id);
  return data ? toTeamBuildingDetail(data) : null;
}
