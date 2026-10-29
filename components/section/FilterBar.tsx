"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FilterModal from "@/components/section/FilterModal";
import SortDropdown from "@/components/ui/SortDropdown";
import {
  filterContent,
  type FilterGroup,
  type SortOption,
} from "@/configs/contents/filter";
import { commonIconUrl } from "@/configs/urls";
import type { TagSelection } from "@/hooks/useTagSelection";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  // 없으면 필터 버튼·모달 없이 정렬만 보여준다.
  groups?: FilterGroup[];
  sortOptions: SortOption[];
  // 현재 정렬 값 (서버에서 URL ?sort를 읽어 넘긴다)
  sort: SortOption["value"];
  // 현재 적용된 필터 (서버에서 URL을 읽어 넘긴다). 넘기면 적용할 때 URL을 바꿔 서버가 다시 거른다.
  // 넘기지 않으면 화면에서만 선택이 남는다.
  selection?: TagSelection;
  className?: string;
}

// 필터 버튼을 누르면 해당 그룹 탭이 선택된 상태로 필터 모달이 열린다.
// 정렬·필터는 URL(?sort=, ?그룹id=항목,항목)로 바꿔 서버가 다시 목록을 만든다. (페이지는 1로)
// TODO: 지원사업 목록은 아직 selection을 넘기지 않아 필터가 목록에 반영되지 않는다.
export default function FilterBar({
  groups = [],
  sortOptions,
  sort,
  selection: urlSelection,
  className,
}: FilterBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const [localSelection, setLocalSelection] = useState<TagSelection>({});
  const selection = urlSelection ?? localSelection;

  // 지금 주소에서 일부 파라미터만 바꿔 이동한다. (페이지 번호는 지운다)
  const pushParams = (update: (params: URLSearchParams) => void) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    update(url.searchParams);
    router.push(`${url.pathname}${url.search}`, { scroll: false });
  };

  const applySelection = (next: TagSelection) => {
    if (!urlSelection) {
      setLocalSelection(next);
      return;
    }
    pushParams((params) => {
      for (const group of groups) {
        const values = next[group.id] ?? [];
        // 모달에서 고른 순서가 아니라 항목 순서대로 넣는다.
        const ordered = group.options.filter((option) =>
          values.includes(option),
        );
        if (ordered.length) params.set(group.id, ordered.join(","));
        else params.delete(group.id);
      }
    });
  };

  const openAt = (groupId: string) => {
    setActiveGroupId(groupId);
    setOpen(true);
  };

  const hasFilters = groups.length > 0;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* 필터 그룹이 없으면 버튼 영역 없이 정렬만 남긴다. */}
      {hasFilters && (
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
      )}

      <SortDropdown
        label={filterContent.sortLabel}
        options={sortOptions.map((option) => option.label)}
        value={
          sortOptions.find((option) => option.value === sort)?.label ??
          sortOptions[0].label
        }
        onChange={(label) => {
          const next = sortOptions.find((option) => option.label === label);
          if (!next || next.value === sort) return;

          pushParams((params) => {
            if (next.value === sortOptions[0].value) params.delete("sort");
            else params.set("sort", next.value);
          });
        }}
      />

      {hasFilters && (
        <FilterModal
          open={open}
          onOpenChange={setOpen}
          groups={groups}
          activeGroupId={activeGroupId}
          onActiveGroupChange={setActiveGroupId}
          initialSelection={selection}
          onApply={applySelection}
        />
      )}
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
