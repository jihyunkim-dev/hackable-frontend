// 목록 페이지네이션 공통 로직. 서버(ServerContainer)에서 URL의 ?page 값으로 계산한다.

export const PAGE_SIZE = {
  project: 12,
  teamBuilding: 8,
  clip: 4,
} as const;

export interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export type PageItem = number | "ellipsis";

// ?page 값을 1 이상의 정수로 바꾼다. 잘못된 값이면 1페이지
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

// 전체 목록에서 현재 페이지 구간만 잘라낸다. 범위를 넘은 페이지는 마지막 페이지로 맞춘다.
// TODO: API 연동 후에는 서버가 페이지 단위로 내려주므로 totalCount만 받아 계산
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: { currentPage, totalPages } satisfies PaginationState,
  };
}

// API가 내려준 전체 개수(total_count)로 페이지 상태를 계산한다.
export function getPagination(
  totalCount: number,
  page: number,
  pageSize: number,
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return { currentPage: Math.min(page, totalPages), totalPages };
}

// 페이지 번호를 API의 skip 값으로 바꾼다.
export const toSkip = (page: number, pageSize: number) =>
  (page - 1) * pageSize;

// 처음·끝 페이지와 현재 페이지 주변만 보여주고 나머지는 말줄임으로 줄인다.
export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2)
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

// 다른 검색 조건(카테고리 등)은 유지한 채 page만 바꾼 링크를 만든다.
export function buildPageHref(
  basePath: string,
  page: number,
  query: Record<string, string | undefined> = {},
): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}
