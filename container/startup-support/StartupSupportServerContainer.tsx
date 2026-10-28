// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectList } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import { getGrantPage } from "@/utils/grant";
import { parsePage } from "@/utils/pagination";
import { parseQuery, parseSort, type SearchParams } from "@/utils/searchParams";
import StartupSupportClientContainer from "./StartupSupportClientContainer";
import StartupSupportServerBlock from "./StartupSupportServerBlock";

export default async function StartupSupportServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page, sort: sortParam, q: qParam } = (await searchParams) ?? {};
  const sort = parseSort(sortParam);
  const q = parseQuery(qParam);

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const { items, pagination } = await getGrantPage(parsePage(page), sort, q);

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyProjectList("support", PAGE_SIZE.project * 7),
  //   parsePage(page),
  //   PAGE_SIZE.project,
  // );

  // TODO: 필터(분야·지역·모집 상태) 반영 (정렬·검색은 반영됨)
  return (
    <StartupSupportClientContainer>
      <StartupSupportServerBlock
        items={items}
        pagination={pagination}
        sort={sort}
        q={q}
      />
    </StartupSupportClientContainer>
  );
}
