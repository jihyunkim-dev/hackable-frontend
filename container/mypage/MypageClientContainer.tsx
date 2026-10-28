"use client";

import { createContext, ReactNode, useSyncExternalStore } from "react";
// import { dummyMypage } from "@/configs/contents/dummyData";
import { useMe } from "@/hooks/useAuth";
import { useMypageActivity } from "@/hooks/useMypage";
import type { MypageActivity } from "@/utils/mypage";
import { getProfileImage } from "@/utils/profile";
import type { UserResponse } from "@/utils/requestToSrv";

export interface MypageProfile {
  name: string;
  role: string;
  image: string | null;
}

interface MypageContextProps {
  // loading: 로그인 확인 중 / guest: 로그인하지 않음 / ready: 로그인함
  status: "loading" | "guest" | "ready";
  profile: MypageProfile | null;
  activity: MypageActivity | null;
  isActivityLoading: boolean;
}

export const MypageContext = createContext({} as MypageContextProps);

// 이름은 닉네임 → 프로필 이름 → 이메일 순으로 쓴다.
function toMypageProfile(user: UserResponse): MypageProfile {
  return {
    name: user.nickname ?? user.profile?.name ?? user.email,
    role: user.profile?.career_position ?? "",
    image: getProfileImage(user),
  };
}

const subscribeNothing = () => () => {};

export default function MypageClientContainer({
  children,
}: {
  children: ReactNode;
}) {
  // [실제 데이터] 로그인 사용자 정보·내 활동
  const { data: user, isPending } = useMe();
  // 서버 HTML은 항상 "확인 중" 화면이다. 헤더가 먼저 로그인 상태를 받아 와도 hydration이 끝나기 전에는 같은 화면을 유지한다.
  const isHydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const activityQuery = useMypageActivity(Boolean(user));
  const MypageContextValues: MypageContextProps = {
    status: !isHydrated || isPending ? "loading" : user ? "ready" : "guest",
    profile: user ? toMypageProfile(user) : null,
    activity: activityQuery.data ?? null,
    isActivityLoading: Boolean(user) && activityQuery.isPending,
  };

  // [더미 데이터] 위 [실제 데이터] 블록을 주석 처리하고 아래 주석을 풀면 더미 데이터로 보인다.
  // const MypageContextValues: MypageContextProps = {
  //   status: "ready",
  //   profile: dummyMypage.profile,
  //   activity: dummyMypage,
  //   isActivityLoading: false,
  // };

  return <MypageContext value={MypageContextValues}>{children}</MypageContext>;
}
