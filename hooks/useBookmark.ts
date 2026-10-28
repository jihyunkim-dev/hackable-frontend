"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useMe } from "@/hooks/useAuth";
import { openLoginModal } from "@/hooks/useLoginModal";
import { useMypageActivity } from "@/hooks/useMypage";
import { queryKeys } from "@/lib/queryKeys";
import type { MypageActivity } from "@/utils/mypage";
import type { BookmarkResponse } from "@/utils/requestToSrv";

export type BookmarkType = "project" | "grant" | "teambuilding" | "clip";

const ERROR_MESSAGE = "북마크를 바꾸지 못했어요. 다시 시도해주세요.";

// 이번 방문에서 누른 북마크 결과. 마이페이지 목록(activity)보다 먼저 본다.
// (클립은 북마크 목록 API가 없어 누른 결과로만 상태를 안다)
type BookmarkOverride = { bookmarked: boolean; count?: number };
const overrides = new Map<string, BookmarkOverride>();
const listeners = new Set<() => void>();

const toKey = (type: BookmarkType, id: string) => `${type}:${id}`;

function setOverride(key: string, value: BookmarkOverride) {
  overrides.set(key, value);
  listeners.forEach((listener) => listener());
}

function deleteOverride(key: string) {
  overrides.delete(key);
  listeners.forEach((listener) => listener());
}

// 로그아웃·탈퇴 때 지운다. (hooks/useAuth clearSession)
export function clearBookmarkOverrides() {
  overrides.clear();
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// 마이페이지 목록에 있으면 북마크한 것으로 본다.
function isInActivity(
  activity: MypageActivity | null | undefined,
  type: BookmarkType,
  id: string,
) {
  if (!activity) return false;
  const { bookmarkedProjects: projects } = activity;
  const items = {
    project: [...projects.hackathon, ...projects.contest],
    grant: projects.support,
    teambuilding: activity.bookmarkedTeamBuildings,
    clip: activity.bookmarkedClips,
  }[type];
  return items.some((item) => item.id === id);
}

// 해제하면 마이페이지 목록에서 바로 뺀다.
function removeFromActivity(
  activity: MypageActivity,
  type: BookmarkType,
  id: string,
): MypageActivity {
  const without = <T extends { id: string }>(items: T[]) =>
    items.filter((item) => item.id !== id);
  const { bookmarkedProjects: projects } = activity;

  return {
    ...activity,
    bookmarkedProjects: {
      hackathon:
        type === "project" ? without(projects.hackathon) : projects.hackathon,
      contest:
        type === "project" ? without(projects.contest) : projects.contest,
      support: type === "grant" ? without(projects.support) : projects.support,
    },
    bookmarkedTeamBuildings:
      type === "teambuilding"
        ? without(activity.bookmarkedTeamBuildings)
        : activity.bookmarkedTeamBuildings,
    bookmarkedClips:
      type === "clip"
        ? without(activity.bookmarkedClips)
        : activity.bookmarkedClips,
  };
}

// 카드·상세의 북마크 버튼 상태와 동작.
// count: 북마크 수를 보여주는 곳(상세)에서 넘기면 누른 뒤 서버가 준 수로 바뀐다.
export function useBookmark(type: BookmarkType, id: string, count?: number) {
  const queryClient = useQueryClient();
  const activityKey = queryKeys.mypage.activity();
  const key = toKey(type, id);

  const { data: user } = useMe();
  const { data: activity } = useMypageActivity(Boolean(user));
  const override = useSyncExternalStore(
    subscribe,
    () => overrides.get(key),
    () => undefined,
  );
  const bookmarked = override?.bookmarked ?? isInActivity(activity, type, id);

  const mutation = useMutation({
    mutationFn: async (next: boolean): Promise<BookmarkResponse> => {
      const res = await fetch(`/api/bookmarks/${type}/${id}`, {
        method: next ? "POST" : "DELETE",
      });
      if (!res.ok) throw new Error(ERROR_MESSAGE);
      return res.json();
    },
    onMutate: async (next) => {
      const previous = overrides.get(key);
      setOverride(key, { ...previous, bookmarked: next });
      if (!next) {
        await queryClient.cancelQueries({ queryKey: activityKey });
        queryClient.setQueryData<MypageActivity | null>(activityKey, (data) =>
          data ? removeFromActivity(data, type, id) : data,
        );
      }
      return { previous };
    },
    onSuccess: (result) => {
      setOverride(key, {
        bookmarked: result.is_bookmarked,
        count: result.bookmark_count,
      });
      // 새로 북마크한 항목이 마이페이지에 보이도록 다시 받는다.
      if (result.is_bookmarked) {
        queryClient.invalidateQueries({ queryKey: activityKey });
      }
    },
    onError: (_error, _next, context) => {
      if (context?.previous) setOverride(key, context.previous);
      else deleteOverride(key);
      queryClient.invalidateQueries({ queryKey: activityKey });
      window.alert(ERROR_MESSAGE);
    },
  });

  const toggle = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!mutation.isPending) mutation.mutate(!bookmarked);
  };

  return {
    bookmarked,
    count: override?.count ?? count,
    toggle,
    isPending: mutation.isPending,
  };
}
