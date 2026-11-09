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
import TeamBuildingServerBlock, {
  type TeamBuildingList,
} from "./TeamBuildingServerBlock";

// 검색 파라미터는 요청 때 정해진다. 기다리지 않고 목록 Promise로 넘겨,
// 배너·작성 버튼은 미리 렌더링하고 주소에 따라 바뀌는 부분만 요청 때 채운다. (ServerBlock 안의 Suspense)
export default function TeamBuildingServerContainer({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const list = searchParams.then(async (params): Promise<TeamBuildingList> => {
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

    return {
      items,
      pagination,
      activeHref: category.href,
      sort,
      q,
      filters,
      query: {
        type: category.value === "all" ? undefined : category.value,
        q: q || undefined,
        sort: toSortQuery(sort),
        ...toFilterQuery(filters),
      },
    };
  });

  return (
    <TeamBuildingClientContainer>
      <TeamBuildingServerBlock list={list} />
    </TeamBuildingClientContainer>
  );
}
