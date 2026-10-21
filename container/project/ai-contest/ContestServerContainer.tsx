import { createDummyProjectList } from "@/configs/contents/dummyData";
import { PAGE_SIZE, paginate, parsePage } from "@/utils/pagination";
import type { SearchParams } from "@/utils/searchParams";
import ContestClientContainer from "./ContestClientContainer";
import ContestServerBlock from "./ContestServerBlock";

export default async function ContestServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page } = (await searchParams) ?? {};

  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체 (검색어·필터·페이지 반영)
  const { items, pagination } = paginate(
    createDummyProjectList("contest", PAGE_SIZE.project * 7),
    parsePage(page),
    PAGE_SIZE.project,
  );

  return (
    <ContestClientContainer>
      <ContestServerBlock items={items} pagination={pagination} />
    </ContestClientContainer>
  );
}
