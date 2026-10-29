import Image from "next/image";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
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
import type { ListSort } from "@/utils/requestToSrv";
import {
  hasTeamBuildingFilters,
  type TeamBuildingFilters,
} from "@/utils/teamBuildingFilter";

interface TeamBuildingServerBlockProps {
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

export default function TeamBuildingServerBlock({
  items,
  pagination,
  activeHref,
  sort,
  q,
  filters,
  query,
}: TeamBuildingServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.teamBuilding} priority />
      <SearchSection
        action="/teambuilding"
        placeholder={teamBuildingContent.searchPlaceholder}
        query={q}
      />
      <TeamBuildingListSection
        items={items}
        pagination={pagination}
        activeHref={activeHref}
        sort={sort}
        q={q}
        filters={filters}
        query={query}
      />
    </DefaultLayout>
  );
}

function TeamBuildingListSection({
  items,
  pagination,
  activeHref,
  sort,
  q,
  filters,
  query,
}: TeamBuildingServerBlockProps) {
  return (
    <section className="py-3">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-3 sm:px-8 xl:px-4">
        {/* md 이상: 카테고리 오른쪽에 작성 버튼. 모바일은 플로팅 + 버튼으로 대신한다. */}
        <div className="flex items-center justify-between gap-3 px-3">
          <CategoryNav
            label="팀빌딩 카테고리"
            items={teamBuildingContent.categories}
            activeHref={activeHref}
          />
          <Button
            asChild
            variant="gradient"
            className="hidden gap-1.5 md:inline-flex"
          >
            {/* 로그인하지 않았으면 이동하지 않고 로그인 모달을 띄운다. */}
            <LoginRequiredLink href={teamBuildingContent.create.href}>
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
        <FilterBar
          groups={teamBuildingContent.filterGroups}
          sortOptions={teamBuildingContent.sortOptions}
          sort={sort}
          selection={filters}
          className="px-3"
        />
        {items.length === 0 && (
          <p className="px-3 py-20 text-center text-body-l text-gray-500">
            {q
              ? `"${q}"에 대한 검색 결과가 없어요.`
              : hasTeamBuildingFilters(filters)
                ? "조건에 맞는 모집글이 없어요. 필터를 바꿔보세요."
                : "아직 등록된 모집글이 없어요."}
          </p>
        )}
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <TeamBuildingCard item={item} />
            </li>
          ))}
        </ul>
      </div>
      <Pagination {...pagination} basePath="/teambuilding" query={query} />
    </section>
  );
}
