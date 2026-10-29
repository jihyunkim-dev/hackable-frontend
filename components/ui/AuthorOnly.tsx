"use client";

import type { ReactNode } from "react";
import { useMe } from "@/hooks/useAuth";

// 로그인한 사용자가 작성자일 때만 children을 보여준다. (수정 버튼 등)
// 서버 HTML·확인 전에는 아무것도 그리지 않는다.
export function useIsAuthor(authorId: number | undefined) {
  const { data: user } = useMe();
  return Boolean(user && authorId !== undefined && user.user_id === authorId);
}

export default function AuthorOnly({
  authorId,
  children,
}: {
  authorId?: number;
  children: ReactNode;
}) {
  return useIsAuthor(authorId) ? children : null;
}
