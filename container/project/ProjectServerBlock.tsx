import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import type { ProjectItem } from "@/components/section/ProjectCard";
import ProjectListSection from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";

interface ProjectServerBlockProps {
  items: ProjectItem[];
  pagination: { currentPage: number; totalPages: number };
}

export default function ProjectServerBlock({
  items,
  pagination,
}: ProjectServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.project} priority />
      <SearchSection
        action="/project"
        placeholder={projectContent.searchPlaceholder}
      />
      <ProjectListSection category="all" items={items} {...pagination} />
    </DefaultLayout>
  );
}
