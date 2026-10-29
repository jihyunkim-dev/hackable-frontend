"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearSession } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryKeys";
import type { MypageActivity } from "@/utils/mypage";
import {
  TEAMBUILDING_STATUS_VALUE,
  type TeamBuildingFormInput,
  toTeambuildingRequest,
} from "@/utils/teamBuildingForm";

// 마이페이지 "내 활동". 로그인 확인(useMe)이 끝난 뒤에만 요청한다.
// 내 정보 요청이 토큰을 재발급하는 동안 함께 요청하면 재발급이 겹쳐 로그인이 끊길 수 있다.
export function useMypageActivity(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.mypage.activity(),
    queryFn: async (): Promise<MypageActivity | null> => {
      const res = await fetch("/api/mypage/activity");
      if (!res.ok) return null;
      const data: { activity: MypageActivity } = await res.json();
      return data.activity;
    },
    enabled,
  });
}

// 내가 쓴 팀빌딩의 모집 상태 변경. 스위치가 바로 바뀌도록 먼저 화면을 고치고, 실패하면 되돌린다.
export function useUpdateTeamBuildingStatus() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const queryKey = queryKeys.mypage.activity();

  const setIsOpen = (id: string, isOpen: boolean) =>
    queryClient.setQueryData<MypageActivity | null>(queryKey, (activity) =>
      activity
        ? {
            ...activity,
            writtenTeamBuildings: activity.writtenTeamBuildings.map((post) =>
              post.id === id ? { ...post, isOpen } : post,
            ),
          }
        : activity,
    );

  return useMutation({
    mutationFn: async ({ id, isOpen }: { id: string; isOpen: boolean }) => {
      const res = await fetch(`/api/teambuildings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: isOpen
            ? TEAMBUILDING_STATUS_VALUE.open
            : TEAMBUILDING_STATUS_VALUE.closed,
        }),
      });
      if (!res.ok) throw new Error("모집 상태를 바꾸지 못했어요.");
    },
    onMutate: async ({ id, isOpen }) => {
      await queryClient.cancelQueries({ queryKey });
      setIsOpen(id, isOpen);
    },
    onError: (_error, { id, isOpen }) => setIsOpen(id, !isOpen),
    // 브라우저가 들고 있던 팀빌딩 목록·상세 화면도 새로 받게 한다.
    onSuccess: () => router.refresh(),
  });
}

// 회원 탈퇴: 성공하면 로그인 상태와 마이페이지 캐시를 비운다.
export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/withdraw", { method: "DELETE" });
      if (!res.ok) throw new Error("탈퇴하지 못했어요.");
    },
    onSuccess: () => clearSession(queryClient),
  });
}

// 팀빌딩 모집글 등록(id 없음)·수정(id 있음). 성공하면 글 id를 돌려준다.
// 내가 쓴 팀빌딩 목록이 바뀌므로 마이페이지 캐시와 브라우저가 들고 있던 화면을 다시 받는다.
export function useSaveTeamBuilding(id?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: TeamBuildingFormInput): Promise<string> => {
      const res = await fetch(
        id ? `/api/teambuildings/${id}` : "/api/teambuildings",
        {
          method: id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toTeambuildingRequest(input)),
        },
      );
      if (!res.ok) throw new Error("모집글을 저장하지 못했어요.");
      const data: { id: number } = await res.json();
      return String(data.id);
    },
    onSuccess: () => {
      router.refresh();
      return queryClient.invalidateQueries({
        queryKey: queryKeys.mypage.activity(),
      });
    },
  });
}

// 팀빌딩 모집글 삭제. 내가 쓴 팀빌딩 목록이 바뀌므로 마이페이지 캐시를 다시 받는다.
// 지운 글의 상세 화면을 다시 그리면 404가 나므로, 화면 새로 받기(router.refresh)는 다른 페이지로 옮긴 뒤 부르는 쪽에서 한다.
export function useDeleteTeamBuilding(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/teambuildings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("모집글을 삭제하지 못했어요.");
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.mypage.activity(),
      }),
  });
}
