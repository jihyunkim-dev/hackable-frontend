import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import NewsletterSection from "@/components/section/NewsletterSection";
import ProjectDetailSection, {
  type ProjectDetail,
} from "@/components/section/ProjectDetailSection";
import PromoBanner from "@/components/section/PromoBanner";
import { bannerContent } from "@/configs/contents/banners";

export default function StartupCompetitionDetailServerBlock({
  detail,
}: {
  detail: ProjectDetail;
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <ProjectDetailSection detail={detail} />
      <PromoBanner {...bannerContent.grants} className="mt-6 lg:mt-12" />
      <NewsletterSection />
    </DefaultLayout>
  );
}
