"use client";

import Image from "next/image";
import { useState } from "react";
import FilterModal from "@/components/section/FilterModal";
import SortDropdown from "@/components/ui/SortDropdown";
import { filterContent, type FilterGroup } from "@/configs/contents/filter";
import { commonIconUrl } from "@/configs/urls";
import type { TagSelection } from "@/hooks/useTagSelection";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  groups: FilterGroup[];
  sortOptions: string[];
  className?: string;
}

// 필터 버튼을 누르면 해당 그룹 탭이 선택된 상태로 필터 모달이 열린다.
// TODO: 적용한 필터·정렬값을 목록 요청(API)에 연결
export default function FilterBar({
  groups,
  sortOptions,
  className,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const [selection, setSelection] = useState<TagSelection>({});
  const [sort, setSort] = useState(sortOptions[0]);

  const openAt = (groupId: string) => {
    setActiveGroupId(groupId);
    setOpen(true);
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="scrollbar-hidden flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2">
        <FilterChip onClick={() => openAt(groups[0]?.id ?? "")}>
          <Image src={commonIconUrl.filter} alt="" width={24} height={24} />
          {filterContent.allButton}
        </FilterChip>
        {groups.map((group) => {
          const count = selection[group.id]?.length ?? 0;
          return (
            <FilterChip
              key={group.id}
              active={count > 0}
              onClick={() => openAt(group.id)}
            >
              {group.label}
              {count > 0 && <span>{count}</span>}
            </FilterChip>
          );
        })}
      </div>

      <SortDropdown
        label={filterContent.sortLabel}
        options={sortOptions}
        value={sort}
        onChange={setSort}
      />

      <FilterModal
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        activeGroupId={activeGroupId}
        onActiveGroupChange={setActiveGroupId}
        initialSelection={selection}
        onApply={setSelection}
      />
    </div>
  );
}

function FilterChip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={cn(
        "flex h-8 shrink-0 items-center justify-center gap-0.5 rounded-lg bg-white p-1 px-2 text-label-s text-gray-700 shadow-xs transition-colors hover:bg-gray-50 lg:text-label-m",
        active && "text-primary-500 ring-1 ring-primary-300",
      )}
    >
      {children}
    </button>
  );
}
