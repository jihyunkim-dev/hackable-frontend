"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { signInContent } from "@/configs/contents/signIn";
import { useMe } from "@/hooks/useAuth";
import { openLoginModal } from "@/hooks/useLoginModal";

const subscribeNothing = () => () => {};

// 로그인한 사용자에게만 children을 보여준다.
// 로그인하지 않았으면 안내를 보여주고 로그인 모달을 바로 띄운다.
export default function LoginGate({
  description,
  children,
}: {
  // 비로그인 안내 문구 (줄 단위)
  description: string[];
  children: ReactNode;
}) {
  const { data: user, isPending } = useMe();
  // 서버 HTML은 항상 "확인 중" 화면이다. hydration이 끝나기 전에는 같은 화면을 유지한다.
  const isHydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const isGuest = isHydrated && !isPending && !user;

  useEffect(() => {
    if (isGuest) openLoginModal();
  }, [isGuest]);

  if (!isHydrated || isPending) return <div className="min-h-[60vh]" />;
  if (isGuest) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-heading-m font-bold text-gray-800">
          {signInContent.required.title}
        </h1>
        <p className="text-body-l text-gray-600">
          <MultiLine lines={description} />
        </p>
        <Button
          variant="secondary"
          onClick={openLoginModal}
          className="mt-3 px-10"
        >
          {signInContent.required.button}
        </Button>
      </section>
    );
  }
  return children;
}
