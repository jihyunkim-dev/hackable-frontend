import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ClipCard from "@/components/section/ClipCard";
import ClipDetailSection, { type ClipDetail } from "@/components/section/ClipDetailSection";
import PromoBanner from "@/components/section/PromoBanner";
import RecommendClipCard, {
  type RecommendClipItem,
} from "@/components/section/RecommendClipCard";
import { bannerContent } from "@/configs/contents/banners";
import { clipContent } from "@/configs/contents/clip";

export default function ClipDetailServerBlock({
  detail,
  recommends,
}: {
  detail: ClipDetail;
  recommends: RecommendClipItem[];
}) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <ClipDetailSection detail={detail} />
      <div className="mx-auto w-full max-w-[992px]">
        <PromoBanner {...bannerContent.subscribe} className="lg:overflow-hidden lg:rounded-2xl" />
      </div>
      <RecommendSection recommends={recommends} />
    </DefaultLayout>
  );
}

// 추천 클립: md 미만은 가로형 클립 카드, md 이상은 세로형 카드 3열
function RecommendSection({ recommends }: { recommends: RecommendClipItem[] }) {
  return (
    <section className="mx-auto w-full max-w-[992px] pb-6 lg:py-3">
      <div className="mx-2 my-4 border-t border-gray-300 lg:mx-0 lg:mt-11 lg:mb-0" />
      <h2 className="px-2.5 py-2.5 text-body-l text-black lg:text-heading-s lg:text-gray-700">
        {clipContent.detail.recommendTitle}
      </h2>

      <ul className="flex flex-col gap-2 p-2.5 md:hidden">
        {recommends.map((item) => (
          <li key={item.id}>
            <ClipCard
              item={{
                id: item.id,
                category: item.tags[0],
                title: item.title,
                description: "",
                readTime: item.readTime,
                createdAt: item.createdAt,
                thumbnail: item.thumbnail,
                href: item.href,
              }}
            />
          </li>
        ))}
      </ul>

      <ul className="hidden grid-cols-3 gap-5 md:grid">
        {recommends.map((item) => (
          <li key={item.id}>
            <RecommendClipCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
