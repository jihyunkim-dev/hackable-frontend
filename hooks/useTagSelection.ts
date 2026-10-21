"use client";

import { useCallback, useMemo, useState } from "react";

export type TagSelection = Record<string, string[]>;

// 그룹별 태그 선택 상태(토글·초기화·개수)를 관리한다.
export function useTagSelection(initial: TagSelection = {}) {
  const [selection, setSelection] = useState<TagSelection>(initial);

  const toggle = useCallback((groupId: string, tag: string) => {
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag];
      return { ...prev, [groupId]: next };
    });
  }, []);

  const reset = useCallback(() => setSelection({}), []);

  const count = useMemo(
    () => Object.values(selection).reduce((sum, tags) => sum + tags.length, 0),
    [selection],
  );

  const isSelected = useCallback(
    (groupId: string, tag: string) =>
      (selection[groupId] ?? []).includes(tag),
    [selection],
  );

  return { selection, setSelection, toggle, reset, count, isSelected };
}
