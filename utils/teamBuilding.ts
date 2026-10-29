// API 팀빌딩 응답을 화면용 카드 데이터로 바꾼다.
import { cacheLife, cacheTag } from "next/cache";
import { isAllowedImageUrl } from "@/configs/imageHosts";
import type { TeamBuildingItem } from "@/components/section/TeamBuildingCard";
import type { TeamBuildingDetail } from "@/components/section/TeamBuildingDetailSection";
import { getPagination, PAGE_SIZE, toSkip } from "@/utils/pagination";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import {
  pickOptions,
  TEAMBUILDING_MODES,
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
} from "@/utils/requestToSrv";
import {
  filterTeamBuildings,
  type TeamBuildingFilters,
} from "@/utils/teamBuildingFilter";

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

// 한 번에 받는 글 수. 필터를 프론트에서 걸어야 해서 글을 전부 받는다.
const FETCH_CHUNK = 100;
// 검색 결과 한 번에 받는 수 (Typesense 최대 250)
const SEARCH_CHUNK = 250;

// 정렬·카테고리에 맞는 글을 전부 받는다.
// TODO: 백엔드 목록 API에 필터 조건과 total_count가 생기면 페이지 단위 요청으로 되돌린다.
async function fetchAllTeamBuildings(
  sort: ListSort,
  category?: TeamBuildingCategory,
) {
  const posts: TeambuildingResponse[] = [];
  for (let skip = 0; ; skip += FETCH_CHUNK) {
    const chunk = await RequestTeambuildingList({
      skip,
      limit: FETCH_CHUNK,
      sort,
      category,
    });
    posts.push(...(chunk ?? []));
    if (!chunk || chunk.length < FETCH_CHUNK) return posts;
  }
}

// 검색어에 맞는 글 id를 관련도 순으로 받는다.
async function searchTeamBuildingIds(q: string) {
  const ids: number[] = [];
  for (let page = 1; ; page += 1) {
    const result = await RequestSearchTeambuilding({
      q,
      page,
      per_page: SEARCH_CHUNK,
    });
    const hits = result?.hits ?? [];
    ids.push(...hits.map((hit) => Number(hit.document.teambuilding_id)));
    if (hits.length < SEARCH_CHUNK || ids.length >= (result?.found ?? 0)) {
      return ids;
    }
  }
}

// 페이지별 목록을 1분간 캐시한다. 사용자가 바로 쓰는 글이라 짧게 둔다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
// 글을 전부 받아 검색어·필터를 걸고 페이지를 나눈다. (utils/teamBuildingFilter)
// - category가 없으면(전체) 카테고리를 보내지 않는다.
// - 검색어(q)가 있으면 검색 결과에 든 글만 관련도 순으로 남긴다. (검색 중에는 정렬이 반영되지 않는다)
//   검색 결과 문서에는 마감일·조회수가 없어, 목록 데이터와 맞춰 카드를 채운다.
export async function getTeamBuildingPage(
  page: number,
  sort: ListSort = "latest",
  q = "",
  category?: TeamBuildingCategory,
  filters?: TeamBuildingFilters,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag(TEAMBUILDING_CACHE_TAG);

  const pageSize = PAGE_SIZE.teamBuilding;
  const [all, searchIds] = await Promise.all([
    fetchAllTeamBuildings(sort, category),
    q ? searchTeamBuildingIds(q) : null,
  ]);

  let posts = all;
  if (searchIds) {
    const byId = new Map(all.map((post) => [post.teambuilding_id, post]));
    posts = searchIds
      .map((id) => byId.get(id))
      .filter((post): post is TeambuildingResponse => Boolean(post));
  }

  const now = Date.now();
  if (filters) posts = filterTeamBuildings(posts, filters, now);

  const pagination = getPagination(posts.length, page, pageSize);
  const start = toSkip(pagination.currentPage, pageSize);

  return {
    items: posts
      .slice(start, start + pageSize)
      .map((post) => toTeamBuildingItem(post, now)),
    pagination,
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
    // TODO: 진행 방식은 백엔드 필드가 생기기 전까지 tags에 들어 있다.
    mode: pickOptions(post.tags, TEAMBUILDING_MODES).join(", "),
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
