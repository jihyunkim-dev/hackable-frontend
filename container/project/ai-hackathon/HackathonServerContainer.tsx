// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectList } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import type { ProjectList } from "@/components/section/ProjectListSection";
import { parsePage } from "@/utils/pagination";
import { getProjectPage } from "@/utils/project";
import { parseQuery, parseSort, type SearchParams } from "@/utils/searchParams";
import HackathonClientContainer from "./HackathonClientContainer";
import HackathonServerBlock from "./HackathonServerBlock";

// 검색 파라미터는 요청 때 정해진다. 기다리지 않고 목록 Promise로 넘겨,
// 배너·제목은 미리 렌더링하고 주소에 따라 바뀌는 부분만 요청 때 채운다. (ServerBlock 안의 Suspense)
export default function HackathonServerContainer({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const list = searchParams.then(async (params): Promise<ProjectList> => {
    const { page, sort: sortParam, q: qParam } = params;
    const sort = parseSort(sortParam);
    const q = parseQuery(qParam);

    // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
    // 세분류 묶음은 configs/contents/project.tsx의 projectApiCategories.hackathon
    const { items, pagination } = await getProjectPage(
      parsePage(page),
      "hackathon",
      sort,
      q,
    );

    // [더미 데이터] 사용 시 아래 주석 해제
    // const { items, pagination } = paginate(
    //   createDummyProjectList("hackathon", PAGE_SIZE.project * 7),
    //   parsePage(page),
    //   PAGE_SIZE.project,
    // );

    return { items, ...pagination, sort, q };
  });

  return (
    <HackathonClientContainer>
      <HackathonServerBlock list={list} />
    </HackathonClientContainer>
  );
}
