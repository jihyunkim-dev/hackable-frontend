import type { ListSort } from "@/utils/requestToSrv";

export type SearchParams = Record<string, string | string[] | undefined>;

// 카테고리 목록에서 URL 파라미터 값과 일치하는 항목을 찾는다. 없으면 첫 항목(전체)
export function findCategory<T extends { value: string }>(
  categories: T[],
  value: string | string[] | undefined,
): T {
  const target = Array.isArray(value) ? value[0] : value;
  return categories.find((item) => item.value === target) ?? categories[0];
}

// ?sort 값을 API 정렬 값으로 바꾼다. 모르는 값이면 최신순
export function parseSort(value: string | string[] | undefined): ListSort {
  const target = Array.isArray(value) ? value[0] : value;
  return target === "deadline" ? "deadline" : "latest";
}

// 페이지 이동 링크에 유지할 정렬 값. 기본값(최신순)은 URL에 남기지 않는다.
export const toSortQuery = (sort: ListSort) =>
  sort === "latest" ? undefined : sort;

// ?q 검색어. 앞뒤 공백을 지우고, 없으면 빈 문자열
export function parseQuery(value: string | string[] | undefined): string {
  const target = Array.isArray(value) ? value[0] : value;
  return target?.trim() ?? "";
}
