"use client";

import { useSyncExternalStore } from "react";
import { afterPageSettled } from "@/lib/afterPageSettled";

// 사이트 공용 로그인 모달 열림 상태. 모달은 레이아웃에 하나만 두고(GlobalSignInModal),
// 로그인이 필요한 버튼(북마크·모집글 작성 등)은 openLoginModal()로 연다.
let isOpen = false;
const listeners = new Set<() => void>();

export function setLoginModalOpen(open: boolean) {
  isOpen = open;
  listeners.forEach((listener) => listener());
}

// 페이지 첫 로드 중에 불리면 로드가 끝난 뒤 연다. (lib/afterPageSettled)
export const openLoginModal = () =>
  afterPageSettled(() => setLoginModalOpen(true));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useLoginModalOpen() {
  return useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false,
  );
}
