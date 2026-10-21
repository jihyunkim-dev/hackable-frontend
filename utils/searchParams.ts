export type SearchParams = Record<string, string | string[] | undefined>;

// 카테고리 목록에서 URL 파라미터 값과 일치하는 항목을 찾는다. 없으면 첫 항목(전체)
export function findCategory<T extends { value: string }>(
  categories: T[],
  value: string | string[] | undefined,
): T {
  const target = Array.isArray(value) ? value[0] : value;
  return categories.find((item) => item.value === target) ?? categories[0];
}
