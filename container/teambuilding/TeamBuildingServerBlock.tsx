import Image from "next/image";
import Link from "next/link";
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
import Pagination from "@/components/ui/Pagination";
import { bannerContent } from "@/configs/contents/banners";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import type { ListSort } from "@/utils/requestToSrv";

interface TeamBuildingServerBlockProps {
  items: TeamBuildingItem[];
  pagination: { currentPage: number; totalPages: number };
  activeHref: string;
  sort: ListSort;
  // 페이지 이동 시 유지할 검색 조건
  query: Record<string, string | undefined>;
}

export default function TeamBuildingServerBlock({
  items,
  pagination,
  activeHref,
  sort,
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
        sort={sort}
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
            <Link href={teamBuildingContent.create.href}>
              <Image
                src={commonIconUrl.plus}
                alt=""
                width={24}
                height={24}
                className="size-5"
              />
              {teamBuildingContent.create.label}
            </Link>
          </Button>
        </div>
        <FilterBar
          groups={teamBuildingContent.filterGroups}
          sortOptions={teamBuildingContent.sortOptions}
          sort={sort}
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
