import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ProjectListSection, {
  type ProjectList,
} from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";

interface StartupCompetitionServerBlockProps {
  // 요청 때 주소를 읽어 가져오는 목록
  list: Promise<ProjectList>;
}

export default function StartupCompetitionServerBlock({
  list,
}: StartupCompetitionServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.grants} priority />
      <SearchSection
        action="/project/startup-competition"
        placeholder={projectContent.searchPlaceholder}
        query={list.then(({ q }) => q)}
      />
      <ProjectListSection category="startup" list={list} />
    </DefaultLayout>
  );
}
