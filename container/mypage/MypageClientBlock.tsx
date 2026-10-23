"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import Switch from "@/components/ui/Switch";
import { mypageContent } from "@/configs/contents/mypage";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";

// 마이페이지는 URL 하나에서 "내 활동" ↔ "계정 설정" 화면을 전환한다.
// 두 화면 내용은 서버에서 렌더링해 넘겨받는다.
export function MypageView({
  activity,
  settings,
}: {
  activity: ReactNode;
  settings: ReactNode;
}) {
  const [view, setView] = useState<"activity" | "settings">("activity");
  const isSettings = view === "settings";

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3 sm:px-6 lg:px-0">
        <h2 className="text-heading-xs font-bold text-gray-800 lg:text-heading-m lg:font-semibold">
          {isSettings
            ? mypageContent.settingsTitle
            : mypageContent.activityTitle}
        </h2>
        {/* 오른쪽 끝: 내 활동에서는 톱니바퀴(계정 설정 열기), 계정 설정에서는 "내 활동 >" */}
        {isSettings ? (
          <button
            type="button"
            onClick={() => setView("activity")}
            className="ml-auto flex items-center rounded-sm px-2 py-1 text-body-l text-primary-500 hover:bg-gray-50"
          >
            {mypageContent.backToActivity}
            <Image
              src={commonIconUrl.chevronSmallPurple}
              alt=""
              width={10}
              height={5}
              className="ml-2 -rotate-90"
            />
          </button>
        ) : (
          <button
            type="button"
            aria-label={mypageContent.settingsLabel}
            onClick={() => setView("settings")}
            className="ml-auto rounded-sm p-2 hover:bg-gray-50"
          >
            <Image src={commonIconUrl.settings} alt="" width={20} height={20} />
          </button>
        )}
      </div>
      {isSettings ? settings : activity}
    </>
  );
}

// 계정 탈퇴 확인 모달
// TODO: 탈퇴 API 연동
export function WithdrawButton() {
  const { withdraw } = mypageContent;
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="w-full rounded-sm bg-gray-100 p-2.5 text-body-l text-gray-700 hover:bg-gray-200"
        >
          {withdraw.button}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white outline-none sm:w-[400px]">
          <div className="flex justify-end p-1">
            <Dialog.Close aria-label={withdraw.confirm.close}>
              <Image
                src={commonIconUrl.close}
                alt=""
                width={40}
                height={40}
                className="size-7"
              />
            </Dialog.Close>
          </div>
          <div className="flex flex-col items-center gap-2 py-3 text-center">
            <Dialog.Title className="text-label-l font-bold text-gray-700">
              {withdraw.confirm.title}
            </Dialog.Title>
            <Dialog.Description className="text-body-m font-medium text-gray-500">
              <MultiLine lines={withdraw.confirm.description} />
            </Dialog.Description>
          </div>
          <div className="flex justify-center gap-2 px-7 py-2 pb-12">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                className="h-8 w-[104px] border-gray-300 text-body-m font-medium text-black hover:bg-gray-50"
              >
                {withdraw.confirm.cancel}
              </Button>
            </Dialog.Close>
            <Button
              onClick={() => setOpen(false)}
              className="h-8 w-[104px] bg-destructive-300 text-body-m font-medium hover:bg-destructive-500"
            >
              {withdraw.confirm.submit}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface MyTeamBuildingPost {
  id: string;
  category: string;
  title: string;
  isOpen: boolean;
  dDay: string;
  author: string;
  views: number;
  bookmarks: number;
  href: string;
}

// 내가 작성한 팀빌딩: 목록에서 바로 모집 상태를 바꿀 수 있다.
// md 미만: 구분선으로 나뉜 목록 (머리줄에 카테고리 + 모집 상태)
// md 이상: 테두리 카드 (머리줄에 모집 상태, 아래에 카테고리, 맨 아래 작성자)
// TODO: 모집 상태 변경 API 연동
export function MyTeamBuildingCard({ post }: { post: MyTeamBuildingPost }) {
  const [isOpen, setIsOpen] = useState(post.isOpen);
  const { statusLabel } = mypageContent.teamBuilding;
  const { remainingSuffix, viewsLabel, bookmarksLabel } =
    teamBuildingContent.card;

  return (
    <div className="flex h-full flex-col gap-1 border-b border-gray-100 bg-white p-3 md:w-[276px] md:gap-2.5 md:rounded-xl md:border md:border-gray-300 md:px-3 md:py-4">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-label-l text-gray-800 md:hidden">
          {post.category}
        </span>
        <span className="text-label-l text-rose-500 md:flex-1 md:text-heading-xs">
          {statusLabel}
        </span>
        <Switch
          checked={isOpen}
          onCheckedChange={setIsOpen}
          label={statusLabel}
        />
      </div>
      <p className="hidden py-1 text-heading-xs text-gray-800 md:block">
        {post.category}
      </p>
      <Link
        href={post.href}
        className="line-clamp-2 text-heading-s font-bold text-gray-800 hover:underline md:line-clamp-3"
      >
        {post.title}
      </Link>
      <p className="flex items-center gap-1">
        <span className="text-heading-xs text-primary-600">{post.dDay}</span>
        <span className="text-label-m text-gray-500">{remainingSuffix}</span>
      </p>
      <div className="mt-auto flex items-center gap-1 pt-2 md:pt-4">
        <span className="hidden py-1 text-label-l text-gray-800 md:inline">
          {post.author}
        </span>
        <span className="ml-auto flex items-center gap-1 p-1 text-label-m text-gray-500">
          <Image
            src={commonIconUrl.eyeSmall}
            alt={viewsLabel}
            width={20}
            height={20}
          />
          {post.views}
        </span>
        <span className="flex items-center gap-1 p-1 text-label-m text-gray-500">
          <Image
            src={commonIconUrl.bookmarkCount}
            alt={bookmarksLabel}
            width={12}
            height={15}
          />
          {post.bookmarks}
        </span>
      </div>
    </div>
  );
}
