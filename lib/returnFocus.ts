// 트리거 없이 여는 공용 모달(로그인·안내)은 Radix가 닫을 때 포커스를 돌려줄 곳을 모른다.
// 열 때 포커스가 있던 요소를 기억했다가, 닫을 때 그 요소로 돌려준다. (키보드 사용자가 위치를 잃지 않게)
export function rememberFocus(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const active = document.activeElement;
  return active instanceof HTMLElement && active !== document.body
    ? active
    : null;
}

// Dialog.Content의 onCloseAutoFocus에 넘긴다.
export function restoreFocus(target: HTMLElement | null) {
  return (event: Event) => {
    if (!target?.isConnected) return;
    event.preventDefault();
    target.focus();
  };
}
