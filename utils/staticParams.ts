// 상세 페이지 generateStaticParams 공통 값.
// 최신 글 몇 개를 빌드 때 본문까지 완성된 페이지로 만든다. 목록에 없는 글은 첫 방문 때 완성 페이지를 만들어 저장한다.
// (Cache Components ISR: node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md)

// 빌드 때 미리 만들 상세 주소 수 (종류별 최신 글)
export const PRERENDER_COUNT = 20;

// cacheComponents에서는 하나 이상 돌려줘야 한다. 글을 받지 못했으면 없는 글 주소(404)를 넣어 빌드 검사만 통과시킨다.
export const withPrerenderFallback = (params: { id: string }[]) =>
  params.length ? params : [{ id: "0" }];

// 상세 주소(/project/ai-hackathon/1269-...)의 마지막 조각
export const lastSegment = (href: string) => href.split("/").pop() ?? "";
