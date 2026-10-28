// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyTeamBuildingList } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { parsePage } from "@/utils/pagination";
import {
  findCategory,
  parseSort,
  toSortQuery,
  type SearchParams,
} from "@/utils/searchParams";
import { getTeamBuildingPage } from "@/utils/teamBuilding";
import TeamBuildingClientContainer from "./TeamBuildingClientContainer";
import TeamBuildingServerBlock from "./TeamBuildingServerBlock";

export default async function TeamBuildingServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { type, page, sort: sortParam } = (await searchParams) ?? {};
  const sort = parseSort(sortParam);
  const category = findCategory(teamBuildingContent.categories, type);

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  // TODO: API에 프로젝트/스터디 구분이 없어 카테고리(type)는 아직 목록에 반영되지 않는다.
  const { items, pagination } = await getTeamBuildingPage(
    parsePage(page),
    sort,
  );

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyTeamBuildingList(PAGE_SIZE.teamBuilding * 7),
  //   parsePage(page),
  //   PAGE_SIZE.teamBuilding,
  // );

  // TODO: 검색어·필터 반영
  return (
    <TeamBuildingClientContainer>
      <TeamBuildingServerBlock
        items={items}
        pagination={pagination}
        activeHref={category.href}
        sort={sort}
        query={{
          type: category.value === "all" ? undefined : category.value,
          sort: toSortQuery(sort),
        }}
      />
    </TeamBuildingClientContainer>
  );
}
