import { Suspense } from "react";
import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
import HubTitle from "@/components/section/HubTitle";
import ProjectCard, {
  type ProjectItem,
} from "@/components/section/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import type { FilterGroup } from "@/configs/contents/filter";
import { cn } from "@/lib/utils";
import { PAGE_SIZE } from "@/utils/pagination";
import type { ListSort } from "@/utils/requestToSrv";
import { toSortQuery } from "@/utils/searchParams";
import {
  projectContent,
  type ProjectCategory,
} from "@/configs/contents/project";

// 주소(?page·sort·q)에 따라 바뀌는 목록
export interface ProjectList {
  items: ProjectItem[];
  currentPage: number;
  totalPages: number;
  sort: ListSort;
  // 검색어. 있으면 검색 결과 목록이다.
  q: string;
}

interface ProjectListSectionProps {
  // support: 지원사업 목록 (카테고리 탭 대신 "지원사업" 제목을 보여준다)
  category: ProjectCategory | "support";
  // 요청 때 주소를 읽어 가져오는 목록
  list: Promise<ProjectList>;
}

// 필터 API 연결 전까지 필터 버튼(필터 전체·그룹별)을 숨기고 정렬만 둔다.
// 다시 쓰려면 undefined 대신 projectContent.filterGroups를 넣는다.
const FILTER_GROUPS: FilterGroup[] | undefined = undefined;

// 해커톤·공모전·창업경진대회 목록 공통 영역 (제목 → 카테고리 → 필터 → 카드 목록 → 페이지네이션)
// H1은 선택된 탭 이름(지원사업은 "지원사업"), 카드(H3) 바로 위에 목록 제목 H2를 둔다.
// 제목·카테고리·설명은 주소와 상관없어 미리 렌더링하고, 정렬·카드·페이지네이션만 요청 때 채운다.
// 기다리는 동안은 같은 크기의 빈 자리만 둬서 HTML에 H1·목록이 한 번씩만 들어간다.
export default function ProjectListSection({
  category,
  list,
}: ProjectListSectionProps) {
  const tab =
    projectContent.categories.find((item) => item.value === category) ??
    projectContent.categories[0];
  const current = category === "support" ? projectContent.startupSupport : tab;
  const title =
    category === "support" ? projectContent.startupSupport.title : tab.label;

  const header =
    category === "support" ? (
      <p className="px-3 text-body-l text-gray-600">{current.description}</p>
    ) : (
      <CategoryNav
        label="프로젝트 카테고리"
        items={projectContent.categories}
        activeHref={current.href}
        description={current.description}
        className="px-3"
      />
    );

  const sortBar = (className: string) => (
    <Suspense
      fallback={
        <div
          aria-hidden
          className={cn(FILTER_GROUPS ? "h-12" : "h-8 w-16", className)}
        />
      }
    >
      {list.then(({ sort }) => (
        <FilterBar
          groups={FILTER_GROUPS}
          sortOptions={projectContent.sortOptions}
          sort={sort}
          className={className}
        />
      ))}
    </Suspense>
  );

  return (
    <section className="py-3">
      <div className="mx-auto flex w-full flex-col gap-2.5 px-3 sm:max-w-[700px] sm:px-0 md:max-w-[920px] lg:max-w-[960px] xl:max-w-[1280px]">
        <HubTitle label={title} className="px-3" />
        {FILTER_GROUPS ? (
          <>
            {header}
            {sortBar("px-3")}
          </>
        ) : (
          // 필터가 없으면 제목·설명 오른쪽 아래에 정렬을 붙여 빈 줄이 생기지 않게 한다.
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">{header}</div>
            {sortBar("shrink-0 pr-3")}
          </div>
        )}

        <Suspense fallback={<ProjectGridSkeleton />}>
          {list.then(({ items, q }) => (
            <>
              {items.length === 0 && (
                <p className="px-3 py-20 text-center text-body-l text-gray-500">
                  {q
                    ? `"${q}"에 대한 검색 결과가 없어요.`
                    : "아직 등록된 공고가 없어요."}
                </p>
              )}
              <h2 className="px-3 pt-2 text-heading-xs font-bold text-gray-800">
                {q ? projectContent.searchListTitle(q) : current.listTitle}
              </h2>
              <ul className={GRID_CLASS}>
                {items.map((item) => (
                  <li key={item.id}>
                    <ProjectCard item={item} variant="plain" />
                  </li>
                ))}
              </ul>
            </>
          ))}
        </Suspense>
      </div>

      <Suspense>
        {list.then(({ currentPage, totalPages, sort, q }) => (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={current.href}
            query={{ q: q || undefined, sort: toSortQuery(sort) }}
          />
        ))}
      </Suspense>
    </section>
  );
}

const GRID_CLASS =
  "grid grid-cols-2 justify-items-center gap-y-2 md:grid-cols-3 sm:gap-y-5 xl:grid-cols-4";

// 목록을 기다리는 동안 목록 제목·카드 자리를 같은 크기로 비워 둔다. (글자·링크 없음)
function ProjectGridSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-2.5">
      <div className="mx-3 mt-2 h-7 w-40 rounded-md bg-gray-100" />
      <ul className={GRID_CLASS}>
        {Array.from({ length: PAGE_SIZE.project }, (_, index) => (
          <li
            key={index}
            className="flex w-[180px] flex-col gap-2 p-3 sm:w-[300px] sm:p-4"
          >
            <div className="h-[150px] rounded-sm bg-gray-100 sm:h-[284px] sm:rounded-lg" />
            <div className="h-[76px] rounded-md bg-gray-100 sm:h-20" />
            <div className="h-10 rounded-md bg-gray-100 sm:h-14" />
          </li>
        ))}
      </ul>
    </div>
  );
}
