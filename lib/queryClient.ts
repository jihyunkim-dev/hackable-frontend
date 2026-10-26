import { isServer, QueryClient } from "@tanstack/react-query";

// TanStack Query는 로그인 사용자 데이터(마이페이지·북마크·글 작성)에 쓴다.
// 공개 목록·상세는 서버 캐시(utils의 "use cache")로 받는다.
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 같은 데이터를 1분 안에 다시 쓰면 요청하지 않는다.
        staleTime: 60 * 1000,
        // 창으로 돌아올 때마다 다시 요청하지 않는다.
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// 서버에서는 요청마다 새로 만들고(사용자 간 데이터 공유 방지), 브라우저에서는 하나를 계속 쓴다.
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
