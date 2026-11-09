import Image from "next/image";
import { Suspense } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
import HubTitle from "@/components/section/HubTitle";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import TeamBuildingCard, {
  type TeamBuildingItem,
} from "@/components/section/TeamBuildingCard";
import Button from "@/components/ui/Button";
import LoginRequiredLink from "@/components/ui/LoginRequiredLink";
import Pagination from "@/components/ui/Pagination";
import { bannerContent } from "@/configs/contents/banners";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { PAGE_SIZE } from "@/utils/pagination";
import type { ListSort } from "@/utils/requestToSrv";
import {
  hasTeamBuildingFilters,
  type TeamBuildingFilters,
} from "@/utils/teamBuildingFilter";

// 주소(?type·page·sort·q·필터)에 따라 바뀌는 목록
export interface TeamBuildingList {
  items: TeamBuildingItem[];
  pagination: { currentPage: number; totalPages: number };
  activeHref: string;
  sort: ListSort;
  // 지금 검색 중인 검색어
  q: string;
  // 지금 적용된 필터 (필터 버튼에 선택 개수로 보인다)
  filters: TeamBuildingFilters;
  // 페이지 이동 시 유지할 검색 조건
  query: Record<string, string | undefined>;
}

interface TeamBuildingServerBlockProps {
  // 요청 때 주소를 읽어 가져오는 목록
  list: Promise<TeamBuildingList>;
}

export default function TeamBuildingServerBlock({
  list,
}: TeamBuildingServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.teamBuilding} priority />
      <SearchSection
        action="/teambuilding"
        placeholder={teamBuildingContent.searchPlaceholder}
        query={list.then(({ q }) => q)}
      />
      <TeamBuildingListSection list={list} />
    </DefaultLayout>
  );
}

// 작성 버튼은 미리 렌더링하고, 탭 제목(H1)·카테고리·필터·목록·페이지네이션은 요청 때 채운다. (?type에 따라 바뀐다)
// 기다리는 동안은 같은 크기의 빈 자리만 둬서 HTML에 H1·목록이 한 번씩만 들어간다.
function TeamBuildingListSection({ list }: TeamBuildingServerBlockProps) {
  // H1은 선택된 탭 이름(전체 / 프로젝트 / 스터디)
  const activeTabOf = (activeHref: string) =>
    teamBuildingContent.categories.find((item) => item.href === activeHref) ??
    teamBuildingContent.categories[0];

  return (
    <section className="py-3">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-3 sm:px-8 xl:px-4">
        <Suspense
          fallback={
            <div
              aria-hidden
              className="mx-3 h-(--text-heading-m--line-height) w-24 animate-pulse rounded-md bg-gray-100"
            />
          }
        >
          {list.then(({ activeHref }) => (
            <HubTitle label={activeTabOf(activeHref).label} className="px-3" />
          ))}
        </Suspense>
        {/* md 이상: 카테고리 오른쪽에 작성 버튼. 모바일은 플로팅 + 버튼으로 대신한다. */}
        <div className="flex items-center justify-between gap-3 px-3">
          <Suspense
            fallback={
              <div
                aria-hidden
                className="h-(--text-heading-s--line-height) w-48 animate-pulse rounded-md bg-gray-100"
              />
            }
          >
            {list.then(({ activeHref }) => (
              <CategoryNav
                label="팀빌딩 카테고리"
                items={teamBuildingContent.categories}
                activeHref={activeHref}
              />
            ))}
          </Suspense>
          <Button
            asChild
            variant="gradient"
            className="hidden gap-1.5 md:inline-flex"
          >
            {/* 로그인하지 않았으면 이동하지 않고 로그인 모달을 띄운다. */}
            <LoginRequiredLink
              href={teamBuildingContent.create.href}
              loginTrigger="teambuilding_create"
            >
              <Image
                src={commonIconUrl.plus}
                alt=""
                width={24}
                height={24}
                className="size-5"
              />
              {teamBuildingContent.create.label}
            </LoginRequiredLink>
          </Button>
        </div>
        {/* 필터 줄 높이: 버튼 h-8(32) + py-2(16) */}
        <Suspense fallback={<div aria-hidden className="h-12" />}>
          {list.then(({ sort, filters }) => (
            <FilterBar
              groups={teamBuildingContent.filterGroups}
              sortOptions={teamBuildingContent.sortOptions}
              sort={sort}
              selection={filters}
              className="px-3"
            />
          ))}
        </Suspense>
        <Suspense fallback={<TeamBuildingGridSkeleton />}>
          {list.then(({ items, q, filters }) => (
            <>
              {items.length === 0 && (
                <p className="px-3 py-20 text-center text-body-l text-gray-500">
                  {q
                    ? `"${q}"에 대한 검색 결과가 없어요.`
                    : hasTeamBuildingFilters(filters)
                      ? "조건에 맞는 모집글이 없어요. 필터를 바꿔보세요."
                      : "아직 등록된 모집글이 없어요."}
                </p>
              )}
              <h2 className="px-3 pt-2 text-heading-xs font-bold text-gray-800">
                {q
                  ? teamBuildingContent.searchListTitle(q)
                  : teamBuildingContent.listTitle}
              </h2>
              <ul className={GRID_CLASS}>
                {items.map((item) => (
                  <li key={item.id}>
                    <TeamBuildingCard item={item} />
                  </li>
                ))}
              </ul>
            </>
          ))}
        </Suspense>
      </div>
      <Suspense>
        {list.then(({ pagination, query }) => (
          <Pagination {...pagination} basePath="/teambuilding" query={query} />
        ))}
      </Suspense>
    </section>
  );
}

const GRID_CLASS =
  "grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4";

// 목록을 기다리는 동안 목록 제목·카드 자리를 같은 크기로 비워 둔다. (글자·링크 없음)
function TeamBuildingGridSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-2.5">
      <div className="mx-3 mt-2 h-7 w-40 rounded-md bg-gray-100" />
      <ul className={GRID_CLASS}>
        {Array.from({ length: PAGE_SIZE.teamBuilding }, (_, index) => (
          <li key={index} className="h-56 rounded-xl bg-gray-100" />
        ))}
      </ul>
    </div>
  );
}
