"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, use, useState } from "react";
import ClipCard from "@/components/section/ClipCard";
import ProjectCard from "@/components/section/ProjectCard";
import SignInModal from "@/components/section/SignInModal";
import TeamBuildingCard, {
  type TeamBuildingItem,
} from "@/components/section/TeamBuildingCard";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import Switch from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { mypageContent } from "@/configs/contents/mypage";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { useLogout } from "@/hooks/useAuth";
import { useUpdateTeamBuildingStatus, useWithdraw } from "@/hooks/useMypage";
import type { MypageActivity } from "@/utils/mypage";
import { MypageContext } from "./MypageClientContainer";

// 로그인 확인 전에는 비워 두고, 로그인하지 않았으면 로그인 안내를 보여준다.
export function MypageAuthGate({ children }: { children: ReactNode }) {
  const { status } = use(MypageContext);
  const { guest } = mypageContent;

  if (status === "loading") return <div className="min-h-[60vh]" />;
  if (status === "guest") {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-heading-m font-bold text-gray-800">
          {guest.title}
        </h1>
        <p className="text-body-l text-gray-600">
          <MultiLine lines={guest.description} />
        </p>
        <SignInModal
          trigger={
            <Button variant="secondary" className="mt-3 px-10">
              {guest.button}
            </Button>
          }
        />
      </section>
    );
  }
  return children;
}

/* ===== 프로필 ===== */

export function ProfileSection() {
  const { profile } = use(MypageContext);
  const router = useRouter();
  const logout = useLogout();

  if (!profile) return null;

  return (
    <section className="flex flex-col gap-6 px-4 py-7 lg:flex-row lg:items-start lg:px-0">
      <div className="flex flex-1 items-start gap-4">
        <ProfileAvatar
          image={profile.image}
          sizes="160px"
          className="size-30 lg:size-40"
          iconClassName="size-10 opacity-40 lg:size-14"
        />
        <div className="flex flex-col gap-2 py-1">
          <h1 className="text-heading-m font-bold text-gray-800 lg:font-semibold">
            {profile.name}
          </h1>
          <p className="text-heading-xs font-bold text-gray-800 lg:font-semibold">
            {profile.role}
          </p>
        </div>
      </div>
      {/* 프로필 수정 아래에 같은 폭으로 로그아웃을 둔다. (모바일: 전체 폭, lg: 오른쪽 124px) */}
      <div className="flex w-full flex-col gap-2 lg:w-31">
        {/* TODO: 프로필 수정 화면 연결 (시안 없음) */}
        <Button
          variant="outline"
          className="h-8 w-full border-gray-300 text-label-l font-bold text-gray-700 hover:bg-gray-50 lg:h-10 lg:font-semibold"
        >
          {mypageContent.profileEdit}
        </Button>
        <Button
          type="button"
          disabled={logout.isPending}
          onClick={() =>
            logout.mutate(undefined, { onSuccess: () => router.replace("/") })
          }
          className="h-8 w-full bg-gray-400 text-label-l font-bold text-white hover:bg-gray-600 lg:h-10 lg:font-semibold"
        >
          {mypageContent.logout}
        </Button>
      </div>
    </section>
  );
}

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
export function WithdrawButton() {
  const { withdraw } = mypageContent;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const withdrawMutation = useWithdraw();

  const handleWithdraw = () =>
    withdrawMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.replace("/");
      },
      onError: () => window.alert(withdraw.confirm.error),
    });

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
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
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

// 내가 작성한 팀빌딩: 목록에서 바로 모집 상태를 바꿀 수 있다.
// md 미만: 구분선으로 나뉜 목록 (머리줄에 카테고리 + 모집 상태)
// md 이상: 테두리 카드 (머리줄에 모집 상태, 아래에 카테고리, 맨 아래 작성자)
function MyTeamBuildingCard({ post }: { post: TeamBuildingItem }) {
  const updateStatus = useUpdateTeamBuildingStatus();
  const { statusLabel, statusError } = mypageContent.teamBuilding;
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
          checked={post.isOpen}
          onCheckedChange={(isOpen) =>
            updateStatus.mutate(
              { id: post.id, isOpen },
              { onError: () => window.alert(statusError) },
            )
          }
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

/* ===== 내 활동 ===== */

export function ActivitySection() {
  const { activity, isActivityLoading } = use(MypageContext);

  return (
    <Tabs defaultValue={mypageContent.tabs[0].value} className="pb-10">
      <TabsList
        aria-label={mypageContent.activityTitle}
        className="justify-start gap-4 border-none px-6 py-3"
      >
        {mypageContent.tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="py-1 text-label-m font-bold text-gray-500 data-[state=active]:border-primary-600 data-[state=active]:text-gray-800 lg:text-heading-xs lg:font-semibold"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {isActivityLoading ? (
        <div className="min-h-60" />
      ) : !activity ? (
        <EmptyMessage>{mypageContent.loadError}</EmptyMessage>
      ) : (
        <>
          <TabsContent value="project">
            <ProjectPanel projects={activity.bookmarkedProjects} />
          </TabsContent>
          <TabsContent value="teamBuilding">
            <TeamBuildingPanel
              bookmarked={activity.bookmarkedTeamBuildings}
              written={activity.writtenTeamBuildings}
            />
          </TabsContent>
          <TabsContent value="clip">
            <PanelTitle>{mypageContent.clip.bookmarkedTitle}</PanelTitle>
            {activity.bookmarkedClips.length === 0 ? (
              <EmptyMessage>{mypageContent.empty}</EmptyMessage>
            ) : (
              <ul className="flex flex-col gap-2.5 px-3 py-2.5 sm:gap-5">
                {activity.bookmarkedClips.map((item) => (
                  <li key={item.id}>
                    <ClipCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="px-6 py-1 text-body-m font-medium text-gray-600 lg:py-2.5 lg:text-heading-xs lg:font-semibold">
      {children}
    </h3>
  );
}

function EmptyMessage({ children }: { children: ReactNode }) {
  return (
    <p className="px-6 py-10 text-center text-body-m text-gray-500">
      {children}
    </p>
  );
}

function ProjectPanel({
  projects,
}: {
  projects: MypageActivity["bookmarkedProjects"];
}) {
  const { bookmarkedTitle, filters } = mypageContent.project;

  return (
    <>
      <PanelTitle>{bookmarkedTitle}</PanelTitle>
      <Tabs defaultValue={filters[0].value}>
        <TabsList
          aria-label={bookmarkedTitle}
          className="justify-start gap-3 border-none px-4 py-3"
        >
          {filters.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="mb-0 h-8 rounded-full border-none bg-gray-100 px-4 text-label-l text-gray-800 data-[state=active]:bg-primary-500 data-[state=active]:text-gray-50"
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {filters.map((filter) => {
          const items = projects[filter.value as keyof typeof projects];
          return (
            <TabsContent key={filter.value} value={filter.value}>
              {items.length === 0 ? (
                <EmptyMessage>{mypageContent.empty}</EmptyMessage>
              ) : (
                <ul className="grid grid-cols-2 justify-items-center gap-y-2 px-1 py-1 sm:gap-y-5 md:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <ProjectCard item={item} variant="plain" />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}

function TeamBuildingPanel({
  bookmarked,
  written,
}: {
  bookmarked: TeamBuildingItem[];
  written: TeamBuildingItem[];
}) {
  const { bookmarkedTitle, writtenTitle } = mypageContent.teamBuilding;

  return (
    <>
      <PanelTitle>{bookmarkedTitle}</PanelTitle>
      {bookmarked.length === 0 ? (
        <EmptyMessage>{mypageContent.empty}</EmptyMessage>
      ) : (
        <ul className="grid gap-2.5 px-5 py-2 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
          {bookmarked.map((item) => (
            <li key={item.id}>
              <TeamBuildingCard item={item} showBookmark />
            </li>
          ))}
        </ul>
      )}

      <div className="pt-10 lg:pt-14">
        <PanelTitle>{writtenTitle}</PanelTitle>
      </div>
      {written.length === 0 ? (
        <EmptyMessage>{mypageContent.empty}</EmptyMessage>
      ) : (
        // md 미만: 구분선 목록 (sm은 2열) / md 이상: 276px 카드를 가로로 나열
        <ul className="grid px-4 py-2 sm:grid-cols-2 sm:gap-x-5 sm:px-6 sm:py-4 md:flex md:flex-wrap md:gap-5 md:py-2.5 lg:gap-7">
          {written.map((post) => (
            <li key={post.id}>
              <MyTeamBuildingCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
