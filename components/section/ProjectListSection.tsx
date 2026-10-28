import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
import ProjectCard, {
  type ProjectItem,
} from "@/components/section/ProjectCard";
import Pagination from "@/components/ui/Pagination";
import type { FilterGroup } from "@/configs/contents/filter";
import type { ListSort } from "@/utils/requestToSrv";
import { toSortQuery } from "@/utils/searchParams";
import {
  projectContent,
  type ProjectCategory,
} from "@/configs/contents/project";

interface ProjectListSectionProps {
  // support: 지원사업 목록 (카테고리 탭 대신 "지원사업" 제목을 보여준다)
  category: ProjectCategory | "support";
  items: ProjectItem[];
  currentPage: number;
  totalPages: number;
  sort: ListSort;
  // 검색어. 있으면 검색 결과 목록이다.
  q?: string;
}

// 필터 API 연결 전까지 필터 버튼(필터 전체·그룹별)을 숨기고 정렬만 둔다.
// 다시 쓰려면 undefined 대신 projectContent.filterGroups를 넣는다.
const FILTER_GROUPS: FilterGroup[] | undefined = undefined;

// 해커톤·공모전·창업경진대회 목록 공통 영역 (카테고리 → 필터 → 카드 목록 → 페이지네이션)
export default function ProjectListSection({
  category,
  items,
  currentPage,
  totalPages,
  sort,
  q = "",
}: ProjectListSectionProps) {
  const current =
    category === "support"
      ? projectContent.startupSupport
      : (projectContent.categories.find((item) => item.value === category) ??
        projectContent.categories[0]);

  const header =
    category === "support" ? (
      <div className="flex flex-col gap-2 px-3 sm:gap-3">
        <h1 className="text-heading-m font-extrabold text-gray-800">
          {projectContent.startupSupport.title}
        </h1>
        <p className="text-body-l text-gray-600">{current.description}</p>
      </div>
    ) : (
      <CategoryNav
        label="프로젝트 카테고리"
        items={projectContent.categories}
        activeHref={current.href}
        description={current.description}
        className="px-3"
      />
    );

  return (
    <section className="py-3">
      <div className="mx-auto flex w-full flex-col gap-2.5 px-3 sm:max-w-[700px] sm:px-0 md:max-w-[920px] lg:max-w-[960px] xl:max-w-[1280px]">
        {FILTER_GROUPS ? (
          <>
            {header}
            <FilterBar
              groups={FILTER_GROUPS}
              sortOptions={projectContent.sortOptions}
              sort={sort}
              className="px-3"
            />
          </>
        ) : (
          // 필터가 없으면 제목·설명 오른쪽 아래에 정렬을 붙여 빈 줄이 생기지 않게 한다.
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">{header}</div>
            <FilterBar
              sortOptions={projectContent.sortOptions}
              sort={sort}
              className="shrink-0 pr-3"
            />
          </div>
        )}

        {items.length === 0 && (
          <p className="px-3 py-20 text-center text-body-l text-gray-500">
            {q
              ? `"${q}"에 대한 검색 결과가 없어요.`
              : "아직 등록된 공고가 없어요."}
          </p>
        )}

        <ul className="grid grid-cols-2 justify-items-center gap-y-2 md:grid-cols-3 sm:gap-y-5 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <ProjectCard item={item} variant="plain" />
            </li>
          ))}
        </ul>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={current.href}
        query={{ q: q || undefined, sort: toSortQuery(sort) }}
      />
    </section>
  );
}
