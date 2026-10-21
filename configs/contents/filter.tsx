export interface FilterGroup {
  id: string;
  label: string;
  options: string[];
}

export const filterContent = {
  allButton: "필터 전체",
  modalTitle: "전체 필터",
  reset: "초기화",
  apply: (count: number) => `${count}개의 태그 적용하기`,
  close: "필터 닫기",
  sortLabel: "정렬",
};
