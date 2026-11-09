import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ProjectListSection, {
  type ProjectList,
} from "@/components/section/ProjectListSection";
import PromoBanner from "@/components/section/PromoBanner";
import SearchSection from "@/components/section/SearchSection";
import { bannerContent } from "@/configs/contents/banners";
import { projectContent } from "@/configs/contents/project";

interface ContestServerBlockProps {
  // 요청 때 주소를 읽어 가져오는 목록
  list: Promise<ProjectList>;
}

export default function ContestServerBlock({ list }: ContestServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <PromoBanner {...bannerContent.contest} priority />
      <SearchSection
        action="/project/ai-contest"
        placeholder={projectContent.searchPlaceholder}
        query={list.then(({ q }) => q)}
      />
      <ProjectListSection category="contest" list={list} />
    </DefaultLayout>
  );
}
