import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import type { ProjectItem } from "@/components/section/ProjectCard";
import ProjectListSection from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";
import type { ListSort } from "@/utils/requestToSrv";

interface HackathonServerBlockProps {
  items: ProjectItem[];
  pagination: { currentPage: number; totalPages: number };
  sort: ListSort;
  q: string;
}

export default function HackathonServerBlock({
  items,
  pagination,
  sort,
  q,
}: HackathonServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.hackathon} priority />
      <SearchSection
        action="/project/ai-hackathon"
        placeholder={projectContent.searchPlaceholder}

        query={q}      />
      <ProjectListSection
        category="hackathon"
        items={items}
        sort={sort}
        q={q}
        {...pagination}
      />
    </DefaultLayout>
  );
}
