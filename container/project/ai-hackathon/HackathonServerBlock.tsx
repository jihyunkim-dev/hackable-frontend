import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import type { ProjectItem } from "@/components/section/ProjectCard";
import ProjectListSection from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";

interface HackathonServerBlockProps {
  items: ProjectItem[];
  pagination: { currentPage: number; totalPages: number };
}

export default function HackathonServerBlock({
  items,
  pagination,
}: HackathonServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.hackathon} priority />
      <SearchSection
        action="/project/ai-hackathon"
        placeholder={projectContent.searchPlaceholder}
      />
      <ProjectListSection category="hackathon" items={items} {...pagination} />
    </DefaultLayout>
  );
}
