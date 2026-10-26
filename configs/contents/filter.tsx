import type { ListSort } from "@/utils/requestToSrv";

export interface SortOption {
  value: ListSort;
  label: string;
}

// 목록 정렬 (URL ?sort= 값이자 API sort 값). 첫 항목이 기본값
export const defaultSortOptions = [
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
] satisfies SortOption[];

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

// 목록 필터 모달 그룹. 지원사업·프로젝트·팀빌딩이 같은 구성을 쓴다.
export const defaultFilterGroups = [
  {
    id: "position",
    label: "포지션",
    options: [
      "기획",
      "마케팅",
      "디자이너",
      "백엔드 개발자",
      "프론트엔드 개발자",
      "AI 엔지니어",
    ],
  },
  { id: "period", label: "기간", options: ["단기(1~3달)", "중장기(3~6달)"] },
  { id: "mode", label: "진행 방식", options: ["온라인", "오프라인"] },
  // TODO: 피그마에 모집 상태 옵션이 온라인/오프라인으로 들어가 있어 임시 값 사용
  { id: "status", label: "모집 상태", options: ["모집중", "모집마감"] },
] satisfies FilterGroup[];
