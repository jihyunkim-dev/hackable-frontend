import Image from "next/image";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ClipCard, { type ClipItem } from "@/components/section/ClipCard";
import ProjectCard, { type ProjectItem } from "@/components/section/ProjectCard";
import TeamBuildingCard, {
  type TeamBuildingItem,
} from "@/components/section/TeamBuildingCard";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { mypageContent } from "@/configs/contents/mypage";
import {
  MyTeamBuildingCard,
  MypageView,
  WithdrawButton,
  type MyTeamBuildingPost,
} from "./MypageClientBlock";

interface MypageData {
  profile: { name: string; role: string; image: string };
  bookmarkedProjects: Record<"hackathon" | "contest" | "support", ProjectItem[]>;
  bookmarkedTeamBuildings: TeamBuildingItem[];
  writtenTeamBuildings: MyTeamBuildingPost[];
  bookmarkedClips: ClipItem[];
}

export default function MypageServerBlock({ data }: { data: MypageData }) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <div className="mx-auto w-full max-w-[960px] lg:py-6">
        <ProfileSection profile={data.profile} />
        <MypageView
          activity={<ActivitySection data={data} />}
          settings={<WithdrawSection />}
        />
      </div>
    </DefaultLayout>
  );
}

/* ===== 프로필 ===== */

function ProfileSection({ profile }: { profile: MypageData["profile"] }) {
  return (
    <section className="flex flex-col gap-6 px-4 py-7 lg:flex-row lg:items-start lg:px-0">
      <div className="flex flex-1 items-start gap-4">
        <div className="relative size-30 shrink-0 overflow-hidden rounded-full bg-gray-100 lg:size-40">
          <Image src={profile.image} alt="" fill sizes="160px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-2 py-1">
          <h1 className="text-heading-m font-bold text-gray-800 lg:font-semibold">
            {profile.name}
          </h1>
          <p className="text-heading-xs font-bold text-gray-800 lg:font-semibold">
            {profile.role}
          </p>
        </div>
      </div>
      {/* TODO: 프로필 수정 화면 연결 (시안 없음) */}
      <Button
        variant="outline"
        className="h-8 w-full border-gray-300 text-label-l font-bold text-gray-700 hover:bg-gray-50 lg:h-10 lg:w-31 lg:font-semibold"
      >
        {mypageContent.profileEdit}
      </Button>
    </section>
  );
}

/* ===== 내 활동 ===== */

function ActivitySection({ data }: { data: MypageData }) {
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

      <TabsContent value="project">
        <ProjectPanel projects={data.bookmarkedProjects} />
      </TabsContent>
      <TabsContent value="teamBuilding">
        <TeamBuildingPanel
          bookmarked={data.bookmarkedTeamBuildings}
          written={data.writtenTeamBuildings}
        />
      </TabsContent>
      <TabsContent value="clip">
        <PanelTitle>{mypageContent.clip.bookmarkedTitle}</PanelTitle>
        <ul className="flex flex-col gap-2.5 px-3 py-2.5 sm:gap-5">
          {data.bookmarkedClips.map((item) => (
            <li key={item.id}>
              <ClipCard item={item} />
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-6 py-1 text-body-m font-medium text-gray-600 lg:py-2.5 lg:text-heading-xs lg:font-semibold">
      {children}
    </h3>
  );
}

function ProjectPanel({ projects }: { projects: MypageData["bookmarkedProjects"] }) {
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
        {filters.map((filter) => (
          <TabsContent key={filter.value} value={filter.value}>
            <ul className="grid grid-cols-2 justify-items-center gap-y-2 px-1 py-1 sm:gap-y-5 md:grid-cols-3">
              {projects[filter.value as keyof typeof projects].map((item) => (
                <li key={item.id}>
                  <ProjectCard item={item} variant="plain" />
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

function TeamBuildingPanel({
  bookmarked,
  written,
}: {
  bookmarked: TeamBuildingItem[];
  written: MyTeamBuildingPost[];
}) {
  const { bookmarkedTitle, writtenTitle } = mypageContent.teamBuilding;

  return (
    <>
      <PanelTitle>{bookmarkedTitle}</PanelTitle>
      <ul className="grid gap-2.5 px-5 py-2 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
        {bookmarked.map((item) => (
          <li key={item.id}>
            <TeamBuildingCard item={item} bookmarked />
          </li>
        ))}
      </ul>

      <div className="pt-4">
        <PanelTitle>{writtenTitle}</PanelTitle>
      </div>
      <ul className="grid gap-2.5 px-4 py-2 sm:grid-cols-2 sm:gap-5">
        {written.map((post) => (
          <li key={post.id}>
            <MyTeamBuildingCard post={post} />
          </li>
        ))}
      </ul>
    </>
  );
}

/* ===== 계정 설정 (탈퇴) ===== */

function WithdrawSection() {
  const { withdraw } = mypageContent;

  return (
    <section className="flex flex-col gap-2.5 px-4 py-3 lg:px-0">
      <h3 className="px-3 py-3 text-label-l text-gray-800">{withdraw.title}</h3>
      <div className="flex flex-col gap-2.5 p-2.5 text-gray-700">
        <p className="text-body-l">
          <MultiLine lines={withdraw.description} />
        </p>
        <ul className="text-body-m">
          {withdraw.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="p-2 sm:max-w-[360px]">
        <WithdrawButton />
      </div>
    </section>
  );
}
