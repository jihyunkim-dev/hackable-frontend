import { cacheLife } from "next/cache";
// [더미 데이터] 사용 시 아래 import 주석 해제
// import { createDummyProjectList } from "@/configs/contents/dummyData";
import {
  getPagination,
  PAGE_SIZE,
  // paginate, // [더미 데이터]
  parsePage,
  toSkip,
} from "@/utils/pagination";
import { toProjectItem } from "@/utils/project";
import { RequestProjectList } from "@/utils/requestToSrv";
import type { SearchParams } from "@/utils/searchParams";
import ProjectClientContainer from "./ProjectClientContainer";
import ProjectServerBlock from "./ProjectServerBlock";

// 페이지별 목록을 1분간 캐시한다. (미리 렌더링되는 1페이지 화면도 이 결과를 쓴다)
async function getProjectPage(page: number) {
  "use cache";
  cacheLife("minutes");

  const data = await RequestProjectList({
    skip: toSkip(page, PAGE_SIZE.project),
    limit: PAGE_SIZE.project,
  });
  const now = Date.now();

  return {
    items: (data?.items ?? []).map((project) => toProjectItem(project, now)),
    pagination: getPagination(data?.total_count ?? 0, page, PAGE_SIZE.project),
  };
}

export default async function ProjectServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { page } = (await searchParams) ?? {};

  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const { items, pagination } = await getProjectPage(parsePage(page));

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items, pagination } = paginate(
  //   createDummyProjectList("all", PAGE_SIZE.project * 7),
  //   parsePage(page),
  //   PAGE_SIZE.project,
  // );

  // TODO: 검색어·필터·정렬 반영
  return (
    <ProjectClientContainer>
      <ProjectServerBlock items={items} pagination={pagination} />
    </ProjectClientContainer>
  );
}
