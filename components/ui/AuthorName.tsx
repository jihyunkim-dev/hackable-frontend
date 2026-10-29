"use client";

import { useMe } from "@/hooks/useAuth";
import { getDisplayName } from "@/utils/profile";

// 게시물 작성자 이름. 이름이 없으면(API에 author_id만 오는 경우) 내가 쓴 글일 때만 내 이름을 보여준다.
// TODO: API가 작성자 이름을 주면 author만 쓰고 이 확인은 지운다.
export default function AuthorName({
  author,
  authorId,
  className,
}: {
  author: string;
  authorId?: number;
  className?: string;
}) {
  const { data: user } = useMe();
  const name =
    author || (user && user.user_id === authorId ? getDisplayName(user) : "");

  if (!name) return null;
  return <span className={className}>{name}</span>;
}
