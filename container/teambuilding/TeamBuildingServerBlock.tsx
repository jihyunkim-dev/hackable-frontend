import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import TeamBuildingCard, {
  type TeamBuildingItem,
} from "@/components/section/TeamBuildingCard";
import Pagination from "@/components/ui/Pagination";
import { bannerContent } from "@/configs/contents/banners";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";

interface TeamBuildingServerBlockProps {
  items: TeamBuildingItem[];
  pagination: { currentPage: number; totalPages: number };
  activeHref: string;
  // 페이지 이동 시 유지할 검색 조건
  query: Record<string, string | undefined>;
}

export default function TeamBuildingServerBlock({
  items,
  pagination,
  activeHref,
  query,
}: TeamBuildingServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.teamBuilding} priority />
      <SearchSection
        action="/teambuilding"
        placeholder={teamBuildingContent.searchPlaceholder}
      />
      <TeamBuildingListSection
        items={items}
        pagination={pagination}
        activeHref={activeHref}
        query={query}
      />
    </DefaultLayout>
  );
}

function TeamBuildingListSection({
  items,
  pagination,
  activeHref,
  query,
}: TeamBuildingServerBlockProps) {
  return (
    <section className="py-3">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-3 sm:px-8 xl:px-4">
        <CategoryNav
          label="팀빌딩 카테고리"
          items={teamBuildingContent.categories}
          activeHref={activeHref}
          className="px-3"
        />
        <FilterBar
          groups={teamBuildingContent.filterGroups}
          sortOptions={teamBuildingContent.sortOptions}
          className="px-3"
        />
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
