"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useAlertMessage } from "@/hooks/useAlertModal";
import {
  getLoginModalOpener,
  setLoginModalOpen,
  useLoginModalOpen,
} from "@/hooks/useLoginModal";
import { restoreFocus } from "@/lib/returnFocus";

// 레이아웃에 하나씩 두는 공용 로그인·안내 모달.
// 모달 코드(Radix Dialog)는 처음 열릴 때 받는다. (첫 화면에서 받는 JS를 줄인다)
const SignInModal = dynamic(() => import("@/components/section/SignInModal"));
const AlertModal = dynamic(() => import("@/components/section/AlertModal"));

// 한 번 열린 뒤에는 계속 둔다. (다시 열 때 새로 받거나 처음부터 그리지 않게)
function useOpenedOnce(open: boolean) {
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return opened;
}

// 로그인 모달. openLoginModal()로 연다. (hooks/useLoginModal)
export function GlobalSignInModal() {
  const open = useLoginModalOpen();
  const opened = useOpenedOnce(open);
  if (!opened) return null;
  return (
    <SignInModal
      open={open}
      onOpenChange={setLoginModalOpen}
      onCloseAutoFocus={restoreFocus(getLoginModalOpener())}
    />
  );
}

// 안내 모달. showAlert()로 연다. (hooks/useAlertModal)
export function GlobalAlertModal() {
  const alert = useAlertMessage();
  const opened = useOpenedOnce(alert !== null);
  if (!opened) return null;
  return <AlertModal alert={alert} />;
}
