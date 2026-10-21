import CategoryNav from "@/components/section/CategoryNav";
import FilterBar from "@/components/section/FilterBar";
import ProjectCard, {
  type ProjectItem,
} from "@/components/section/ProjectCard";
import Pagination from "@/components/ui/Pagination";
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
}

// 해커톤·공모전·창업경진대회 목록 공통 영역 (카테고리 → 필터 → 카드 목록 → 페이지네이션)
export default function ProjectListSection({
  category,
  items,
  currentPage,
  totalPages,
}: ProjectListSectionProps) {
  const current =
    category === "support"
      ? projectContent.startupSupport
      : (projectContent.categories.find((item) => item.value === category) ??
        projectContent.categories[0]);

  return (
    <section className="py-3">
      <div className="mx-auto flex w-full flex-col gap-2.5 px-3 sm:max-w-[700px] sm:px-0 md:max-w-[920px] lg:max-w-[960px] xl:max-w-[1280px]">
        {category === "support" ? (
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
        )}

        <FilterBar
          groups={projectContent.filterGroups}
          sortOptions={projectContent.sortOptions}
          className="px-3"
        />

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
      />
    </section>
  );
}
