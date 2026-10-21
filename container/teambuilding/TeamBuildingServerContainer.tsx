import { createDummyTeamBuildingList } from "@/configs/contents/dummyData";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { PAGE_SIZE, paginate, parsePage } from "@/utils/pagination";
import { findCategory, type SearchParams } from "@/utils/searchParams";
import TeamBuildingClientContainer from "./TeamBuildingClientContainer";
import TeamBuildingServerBlock from "./TeamBuildingServerBlock";

export default async function TeamBuildingServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { type, page } = (await searchParams) ?? {};
  const category = findCategory(teamBuildingContent.categories, type);

  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체 (카테고리·검색어·필터·페이지 반영)
  const { items, pagination } = paginate(
    createDummyTeamBuildingList(PAGE_SIZE.teamBuilding * 7),
    parsePage(page),
    PAGE_SIZE.teamBuilding,
  );

  return (
    <TeamBuildingClientContainer>
      <TeamBuildingServerBlock
        items={items}
        pagination={pagination}
        activeHref={category.href}
        query={{ type: category.value === "all" ? undefined : category.value }}
      />
    </TeamBuildingClientContainer>
  );
}
