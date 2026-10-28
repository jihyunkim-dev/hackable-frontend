import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import type { ProjectItem } from "@/components/section/ProjectCard";
import ProjectListSection from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";
import type { ListSort } from "@/utils/requestToSrv";

interface StartupCompetitionServerBlockProps {
  items: ProjectItem[];
  pagination: { currentPage: number; totalPages: number };
  sort: ListSort;
  q: string;
}

export default function StartupCompetitionServerBlock({
  items,
  pagination,
  sort,
  q,
}: StartupCompetitionServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.grants} priority />
      <SearchSection
        action="/project/startup-competition"
        placeholder={projectContent.searchPlaceholder}

        query={q}
      />
      <ProjectListSection
        category="startup"
        items={items}
        sort={sort}
        q={q}
        {...pagination}
      />
    </DefaultLayout>
  );
}
