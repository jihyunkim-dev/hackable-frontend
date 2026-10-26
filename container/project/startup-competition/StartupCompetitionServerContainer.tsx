// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectList } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import { parsePage } from "@/utils/pagination";
import { getProjectPage } from "@/utils/project";
import {
  parseQuery,
  parseSort,
  type SearchParams,
} from "@/utils/searchParams";
import StartupCompetitionClientContainer from "./StartupCompetitionClientContainer";
import StartupCompetitionServerBlock from "./StartupCompetitionServerBlock";

export default async function StartupCompetitionServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page, sort: sortParam, q: qParam } = (await searchParams) ?? {};
  const sort = parseSort(sortParam);
  const q = parseQuery(qParam);

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  // 세분류 묶음은 configs/contents/project.tsx의 projectApiCategories.startup
  const { items, pagination } = await getProjectPage(
    parsePage(page),
    "startup",
    sort,
    q,
  );

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyProjectList("startup", PAGE_SIZE.project * 7),
  //   parsePage(page),
  //   PAGE_SIZE.project,
  // );

  return (
    <StartupCompetitionClientContainer>
      <StartupCompetitionServerBlock items={items} pagination={pagination} sort={sort} q={q} />
    </StartupCompetitionClientContainer>
  );
}
