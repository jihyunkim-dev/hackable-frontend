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
import ProjectClientContainer from "./ProjectClientContainer";
import ProjectServerBlock from "./ProjectServerBlock";

export default async function ProjectServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page, sort: sortParam, q: qParam } = (await searchParams) ?? {};
  const sort = parseSort(sortParam);
  const q = parseQuery(qParam);

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const { items, pagination } = await getProjectPage(
    parsePage(page),
    "all",
    sort,
    q,
  );

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyProjectList("all", PAGE_SIZE.project * 7),
  //   parsePage(page),
  //   PAGE_SIZE.project,
  // );

  return (
    <ProjectClientContainer>
      <ProjectServerBlock items={items} pagination={pagination} sort={sort} q={q} />
    </ProjectClientContainer>
  );
}
