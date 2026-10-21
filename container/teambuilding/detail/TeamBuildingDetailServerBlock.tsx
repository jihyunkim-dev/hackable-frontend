import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import BannerCarousel from "@/components/section/BannerCarousel";
import TeamBuildingDetailSection, {
  type TeamBuildingDetail,
} from "@/components/section/TeamBuildingDetailSection";
import { bannerContent } from "@/configs/contents/banners";

const promoBanners = [
  bannerContent.hackathon,
  bannerContent.contest,
  bannerContent.grants,
  bannerContent.subscribe,
];

export default function TeamBuildingDetailServerBlock({
  detail,
}: {
  detail: TeamBuildingDetail;
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <TeamBuildingDetailSection
        detail={detail}
        banner={<BannerCarousel banners={promoBanners} />}
      />
    </DefaultLayout>
  );
}
