import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import type { ProjectItem } from "@/components/section/ProjectCard";
import ProjectListSection from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";

interface StartupSupportServerBlockProps {
  items: ProjectItem[];
  pagination: { currentPage: number; totalPages: number };
}

export default function StartupSupportServerBlock({
  items,
  pagination,
}: StartupSupportServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.startupSupport} priority />
      <SearchSection
        action={projectContent.startupSupport.href}
        placeholder={projectContent.startupSupport.searchPlaceholder}
      />
      <ProjectListSection category="support" items={items} {...pagination} />
    </DefaultLayout>
  );
}
