"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { useMe } from "@/hooks/useAuth";
import { openLoginModal } from "@/hooks/useLoginModal";

// 로그인한 사용자만 이동하는 링크. 로그인하지 않았으면 이동하지 않고 로그인 모달을 띄운다.
export default function LoginRequiredLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const { data: user } = useMe();

  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (user) return;
        event.preventDefault();
        openLoginModal();
      }}
    />
  );
}
