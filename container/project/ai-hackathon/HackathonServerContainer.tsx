import { createDummyProjectList } from "@/configs/contents/dummyData";
import { PAGE_SIZE, paginate, parsePage } from "@/utils/pagination";
import type { SearchParams } from "@/utils/searchParams";
import HackathonClientContainer from "./HackathonClientContainer";
import HackathonServerBlock from "./HackathonServerBlock";

export default async function HackathonServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page } = (await searchParams) ?? {};

  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체 (검색어·필터·페이지 반영)
  const { items, pagination } = paginate(
    createDummyProjectList("hackathon", PAGE_SIZE.project * 7),
    parsePage(page),
    PAGE_SIZE.project,
  );

  return (
    <HackathonClientContainer>
      <HackathonServerBlock items={items} pagination={pagination} />
    </HackathonClientContainer>
  );
}
