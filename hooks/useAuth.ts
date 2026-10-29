"use client";

import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
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

// 로그인 여부 표시 쿠키 (utils/authSession의 AUTH_COOKIE.hint와 같은 이름. 서버 전용 파일이라 가져오지 않는다)
const LOGIN_HINT_COOKIE = "hk_logged_in";
const subscribeNothing = () => () => {};
const hasLoginHint = () =>
  document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${LOGIN_HINT_COOKIE}=`));

export type AccountState =
  // 서버 렌더·hydration 중: 아직 알 수 없음 (자리만 잡아 둔다)
  | { status: "unknown" }
  | { status: "guest" }
  // user가 null이면 로그인은 했지만 사용자 정보를 받아오는 중 (기본 프로필 아이콘)
  | { status: "user"; user: UserResponse | null };

// 헤더처럼 로그인 여부로 바로 화면이 갈리는 곳에서 쓴다.
// /api/auth/me 응답 전에는 로그인 여부 표시 쿠키로 판단해 로그인 버튼이 잠깐 보였다 바뀌지 않게 한다.
export function useAccount(): AccountState {
  const { data } = useMe();
  // 서버에서는 쿠키를 모르므로 null. hydration이 끝나면 실제 값으로 바뀐다.
  const hint = useSyncExternalStore(subscribeNothing, hasLoginHint, () => null);

  if (data !== undefined) {
    return data ? { status: "user", user: data } : { status: "guest" };
  }
  if (hint === null) return { status: "unknown" };
  return hint ? { status: "user", user: null } : { status: "guest" };
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

export type SocialProvider = "kakao" | "google";

// 소셜 로그인 시작. 지금 보고 있는 페이지로 돌아오도록 경로를 함께 넘긴다.
// /auth/login/{provider} 는 외부 로그인 페이지로 보내는 서버 라우트라 router.push가 아닌 전체 페이지 이동을 쓴다.
export function startSocialLogin(provider: SocialProvider) {
  const returnTo = `${window.location.pathname}${window.location.search}`;
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- 외부 리다이렉트를 거치는 Route Handler로의 전체 이동
  window.location.href = `/auth/login/${provider}?returnTo=${encodeURIComponent(returnTo)}`;
}
