"use client";

import { useSyncExternalStore } from "react";

// 사이트 공용 안내 모달 (window.alert 대신). 모달은 레이아웃에 하나만 두고(GlobalAlertModal),
// 안내가 필요한 곳에서 showAlert("문구")로 연다. 훅이 아니라 이벤트 핸들러·onError 어디서든 부를 수 있다.
export interface AlertMessage {
  // 한 줄이면 문자열, 여러 줄이면 줄 단위 배열
  message: string | string[];
  title?: string;
}

let current: AlertMessage | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export function showAlert(
  message: AlertMessage["message"],
  options?: Omit<AlertMessage, "message">,
) {
  current = { message, ...options };
  emit();
}

export function closeAlert() {
  current = null;
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useAlertMessage() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
