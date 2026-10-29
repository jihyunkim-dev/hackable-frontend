// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyTeamBuildingList } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { parsePage } from "@/utils/pagination";
import {
  findCategory,
  parseQuery,
  parseSort,
  toSortQuery,
  type SearchParams,
} from "@/utils/searchParams";
import { getTeamBuildingPage } from "@/utils/teamBuilding";
import {
  parseTeamBuildingFilters,
  toFilterQuery,
} from "@/utils/teamBuildingFilter";
import { isTeamBuildingCategory } from "@/utils/teamBuildingForm";
import TeamBuildingClientContainer from "./TeamBuildingClientContainer";
import TeamBuildingServerBlock from "./TeamBuildingServerBlock";

export default async function TeamBuildingServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const { type, page, sort: sortParam, q: qParam } = params;
  const sort = parseSort(sortParam);
  const filters = parseTeamBuildingFilters(params);
  const q = parseQuery(qParam);
  const category = findCategory(teamBuildingContent.categories, type);

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const { items, pagination } = await getTeamBuildingPage(
    parsePage(page),
    sort,
    q,
    isTeamBuildingCategory(category.value) ? category.value : undefined,
    filters,
  );

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyTeamBuildingList(PAGE_SIZE.teamBuilding * 7),
  //   parsePage(page),
  //   PAGE_SIZE.teamBuilding,
  // );

  return (
    <TeamBuildingClientContainer>
      <TeamBuildingServerBlock
        items={items}
        pagination={pagination}
        activeHref={category.href}
        sort={sort}
        q={q}
        filters={filters}
        query={{
          type: category.value === "all" ? undefined : category.value,
          q: q || undefined,
          sort: toSortQuery(sort),
          ...toFilterQuery(filters),
        }}
      />
    </TeamBuildingClientContainer>
  );
}
