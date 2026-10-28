// API 팀빌딩 응답을 화면용 카드 데이터로 바꾼다.
import { cacheLife, cacheTag } from "next/cache";
import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
import type { TeamBuildingDetail } from "@/components/section/TeamBuildingDetailSection";
import { PAGE_SIZE, toSkip } from "@/utils/pagination";
import { TEAMBUILDING_STATUS_VALUE } from "@/utils/teamBuildingForm";
import { formatDate, formatDDay, parseSlugId } from "@/utils/project";
import {
  RequestTeambuildingDetail,
  RequestTeambuildingList,
  type ListSort,
  type TeambuildingResponse,
} from "@/utils/requestToSrv";

// 서버 캐시 이름표. 글 작성·수정 후 revalidateTag("teambuildings")로 이 캐시만 지운다.
export const TEAMBUILDING_CACHE_TAG = "teambuildings";

// TODO: 모집 상태 값 확정 필요 (현재 "recruiting" 또는 null만 옴). 마감 값이 아니면 모집중으로 본다.
export const TEAMBUILDING_STATUS = TEAMBUILDING_STATUS_VALUE;
const CLOSED_STATUS = TEAMBUILDING_STATUS.closed;

export function toTeamBuildingItem(
  post: TeambuildingResponse,
  now: number,
): TeamBuildingItem {
  return {
    id: String(post.teambuilding_id),
    isOpen: post.status !== CLOSED_STATUS,
    // TODO: API에 카테고리 필드가 없어 첫 번째 태그로 대신한다.
    category: post.tags?.[0] ?? "",
    title: post.title,
    dDay: formatDDay(post.end_date, now),
    // TODO: API에 작성자 이름이 없다. (author_id만 옴)
    author: "",
    views: post.view_count,
    bookmarks: post.bookmark_count,
    href: `/teambuilding/${post.teambuilding_id}`,
  };
}

// 페이지별 목록을 1분간 캐시한다. 사용자가 바로 쓰는 글이라 짧게 둔다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
// API가 전체 개수를 주지 않아 한 개 더 요청해서 다음 페이지가 있는지만 판단한다.
export async function getTeamBuildingPage(
  page: number,
  sort: ListSort = "latest",
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(TEAMBUILDING_CACHE_TAG);

  const pageSize = PAGE_SIZE.teamBuilding;
  const data = await RequestTeambuildingList({
    skip: toSkip(page, pageSize),
    limit: pageSize + 1,
    sort,
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
    // TODO: API에 작성자 이름이 없다. (author_id만 옴)
    author: "",
    createdAt: formatDateTime(post.created_at),
    views: post.view_count,
    bookmarks: post.bookmark_count,
    body: post.description ?? "",
    position: post.position?.join(", ") ?? "",
    deadline: post.end_date ? formatDate(post.end_date) : "상시",
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
