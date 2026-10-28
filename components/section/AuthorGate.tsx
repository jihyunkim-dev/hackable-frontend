"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { useIsAuthor } from "@/components/ui/AuthorOnly";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";

// 작성자에게만 children(수정 폼)을 보여준다. LoginGate 안에서 쓰므로 로그인 확인은 끝난 상태다.
// authorId가 없으면(더미 데이터) 확인하지 않는다.
export default function AuthorGate({
  authorId,
  backHref,
  children,
}: {
  authorId?: number;
  backHref: string;
  children: ReactNode;
}) {
  const isAuthor = useIsAuthor(authorId);
  const content = teamBuildingContent.form.notAuthor;

  if (authorId === undefined || isAuthor) return children;

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-heading-m font-bold text-gray-800">
        {content.title}
      </h1>
      <p className="text-body-l text-gray-600">
        <MultiLine lines={content.description} />
      </p>
      <Button asChild variant="secondary" className="mt-3 px-10">
        <Link href={backHref}>{content.back}</Link>
      </Button>
    </section>
  );
}
