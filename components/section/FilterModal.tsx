"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { filterContent, type FilterGroup } from "@/configs/contents/filter";
import { commonIconUrl } from "@/configs/urls";
import { useTagSelection, type TagSelection } from "@/hooks/useTagSelection";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: FilterGroup[];
  activeGroupId: string;
  onActiveGroupChange: (groupId: string) => void;
  initialSelection: TagSelection;
  onApply: (selection: TagSelection) => void;
}

// 모바일은 하단 시트, sm 이상은 화면 중앙 모달로 열린다.
export default function FilterModal(props: FilterModalProps) {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#1f1f1f]/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[85dvh] flex-col rounded-t-2xl bg-white p-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] outline-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:h-[540px] sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6 md:w-[540px] lg:h-[720px] lg:w-[720px] lg:p-8"
        >
          {/* 열릴 때마다 현재 적용된 선택값으로 초안을 새로 만든다. */}
          {props.open && <FilterModalBody {...props} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FilterModalBody({
  groups,
  activeGroupId,
  onActiveGroupChange,
  initialSelection,
  onApply,
  onOpenChange,
}: FilterModalProps) {
  const draft = useTagSelection(initialSelection);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const moveToGroup = (groupId: string) => {
    onActiveGroupChange(groupId);
    sectionRefs.current[groupId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 px-2 py-1 lg:py-2">
        <Dialog.Title className="flex-1 text-heading-s text-gray-700">
          {filterContent.modalTitle}
        </Dialog.Title>
        <Dialog.Close aria-label={filterContent.close}>
          <Image
            src={commonIconUrl.close}
            alt=""
            width={40}
            height={40}
            className="size-7 lg:size-10"
          />
        </Dialog.Close>
      </div>

      <div
        role="tablist"
        aria-label={filterContent.modalTitle}
        className="scrollbar-hidden flex shrink-0 gap-2 overflow-x-auto px-2 py-1"
      >
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={group.id === activeGroupId}
            onClick={() => moveToGroup(group.id)}
            className={cn(
              "shrink-0 border-b-2 border-transparent p-2.5 text-label-m text-gray-500 transition-colors lg:text-label-l",
              group.id === activeGroupId && "border-primary-500 text-primary-500",
            )}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {groups.map((group) => (
          <section
            key={group.id}
            ref={(node) => {
              sectionRefs.current[group.id] = node;
            }}
            aria-label={group.label}
            className="flex scroll-mt-2 flex-col gap-2.5 px-3 py-2 not-last:mb-3"
          >
            <h3 className="text-label-m text-gray-800 lg:text-label-l">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2 py-1">
              {group.options.map((option) => {
                const selected = draft.isSelected(group.id, option);
                return (
                  <li key={option}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => draft.toggle(group.id, option)}
                      className={cn(
                        "rounded-lg border border-gray-300 px-2 py-1 text-label-m text-gray-700 transition-colors lg:text-label-l",
                        selected &&
                          "border-primary-500 bg-primary-50 text-primary-500",
                      )}
                    >
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex shrink-0 gap-2.5 p-2.5 lg:gap-2 lg:px-0 lg:pb-0">
        <Button
          variant="outline"
          onClick={draft.reset}
          className="h-9 w-[92px] rounded-sm border-gray-300 text-label-m font-semibold text-gray-700 hover:bg-gray-50 lg:h-12 lg:rounded-lg lg:text-label-l"
        >
          {filterContent.reset}
        </Button>
        <Button
          onClick={() => {
            onApply(draft.selection);
            onOpenChange(false);
          }}
          className="h-9 flex-1 rounded-sm text-label-m font-semibold lg:h-12 lg:rounded-lg lg:text-label-l"
        >
          {filterContent.apply(draft.count)}
        </Button>
      </div>
    </>
  );
}
