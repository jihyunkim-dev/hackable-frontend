"use client";

import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { clearBookmarkOverrides } from "@/hooks/useBookmark";
import { queryKeys } from "@/lib/queryKeys";
import type { UserResponse } from "@/utils/requestToSrv";

// 로그인한 사용자 정보. 로그인하지 않았으면 user가 null
// 토큰은 httpOnly 쿠키에 있어 브라우저는 우리 서버(/api/auth/me)를 거쳐 받는다.
export function useMe() {
  return useQuery({
    queryKey: queryKeys.mypage.me(),
    queryFn: async (): Promise<UserResponse | null> => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      const data: { user: UserResponse | null } = await res.json();
      return data.user;
    },
    // 로그인 상태는 자주 바뀌지 않으므로 5분간 다시 묻지 않는다.
    staleTime: 5 * 60 * 1000,
  });
}

// 로그아웃·탈퇴 뒤: 로그인 상태를 비로그인으로 바꾸고 나머지 마이페이지 캐시를 지운다.
export function clearSession(queryClient: QueryClient) {
  clearBookmarkOverrides();
  queryClient.setQueryData(queryKeys.mypage.me(), null);
  queryClient.removeQueries({
    queryKey: queryKeys.mypage.all,
    predicate: (query) => query.queryKey[1] !== "me",
  });
}

// 로그아웃: 쿠키를 지우고 마이페이지 관련 캐시를 모두 비운다.
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => clearSession(queryClient),
  });
}

// 카카오 로그인 시작. 지금 보고 있는 페이지로 돌아오도록 경로를 함께 넘긴다.
// /auth/login/kakao 는 카카오(외부 사이트)로 보내는 서버 라우트라 router.push가 아닌 전체 페이지 이동을 쓴다.
export function startKakaoLogin() {
  const returnTo = `${window.location.pathname}${window.location.search}`;
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- 외부 리다이렉트를 거치는 Route Handler로의 전체 이동
  window.location.href = `/auth/login/kakao?returnTo=${encodeURIComponent(returnTo)}`;
}
