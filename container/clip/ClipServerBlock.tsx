import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ClipCard, { type ClipItem } from "@/components/section/ClipCard";
import ClipFeaturedCarousel, {
  type FeaturedClip,
} from "@/components/section/ClipFeaturedCarousel";
import PromoBanner from "@/components/section/PromoBanner";
import WeeklyClipList, {
  type WeeklyClipItem,
} from "@/components/section/WeeklyClipList";
import CategoryPills from "@/components/ui/CategoryPills";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { bannerContent } from "@/configs/contents/banners";
import { clipContent } from "@/configs/contents/clip";
import { subscribeClipBannerUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

interface ClipServerBlockProps {
  featured: FeaturedClip[];
  weekly: { title: string; items: WeeklyClipItem[] };
  clips: ClipItem[];
  pagination: { currentPage: number; totalPages: number };
  activeCategoryHref: string;
  // 페이지 이동 시 유지할 검색 조건
  query: Record<string, string | undefined>;
}

export default function ClipServerBlock({
  featured,
  weekly,
  clips,
  pagination,
  activeCategoryHref,
  query,
}: ClipServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <SearchSection />
      <HighlightSection featured={featured} weekly={weekly} />
      <ClipListSection
        clips={clips}
        pagination={pagination}
        activeCategoryHref={activeCategoryHref}
        query={query}
      />
    </DefaultLayout>
  );
}

function SearchSection() {
  return (
    <section className="flex justify-center p-2 py-5 lg:py-3.5">
      <SearchBar action="/clip" placeholder={clipContent.searchPlaceholder} />
    </section>
  );
}

// 클립 페이지 본문 폭. 캐러셀·배너 영역과 아래 목록을 같은 폭으로 맞춘다. (피그마: lg 1020px, xl 1200px)
const CONTENT_WIDTH = "mx-auto w-full lg:max-w-[1020px] xl:max-w-[1200px]";

// 추천 캐러셀 + 구독 배너 + 주간 인기 클립
// lg 미만: 세로로 쌓임 / lg 이상: 왼쪽(캐러셀·배너) + 오른쪽(인기 클립) 2단
// 피그마: lg 1020px(620 + 380), xl 1200px(777 + 399), 칸 사이 20px
function HighlightSection({
  featured,
  weekly,
}: Pick<ClipServerBlockProps, "featured" | "weekly">) {
  const banner = bannerContent.subscribe;

  return (
    <section
      className={cn(
        CONTENT_WIDTH,
        "grid gap-y-2 lg:grid-cols-[1fr_380px] lg:gap-5 lg:py-5 xl:grid-cols-[1fr_399px]",
      )}
    >
      {/* 추천 클립이 없으면 캐러셀 자리를 비우지 않고 뺀다. */}
      {featured.length > 0 && (
        <div className="px-3 py-4 lg:p-0">
          <ClipFeaturedCarousel
            label={clipContent.featuredLabel}
            items={featured}
          />
        </div>
      )}
      <WeeklyClipList
        title={weekly.title}
        items={weekly.items}
        className="py-2.5 lg:row-span-2 lg:rounded-[20px] lg:border lg:border-gray-200 lg:p-3 xl:p-6"
      />
      <PromoBanner
        {...banner}
        images={{ ...banner.images, lg: subscribeClipBannerUrl }}
        className="lg:overflow-hidden lg:rounded-3xl"
      />
    </section>
  );
}

function ClipListSection({
  clips,
  pagination,
  activeCategoryHref,
  query,
}: Pick<
  ClipServerBlockProps,
  "clips" | "pagination" | "activeCategoryHref" | "query"
>) {
  return (
    <section>
      <div className={cn(CONTENT_WIDTH, "px-3 py-2 lg:px-0")}>
        <div className="flex flex-col gap-1 px-2 py-2 lg:gap-2">
          <h1 className="text-heading-m font-extrabold text-gray-800">
            {clipContent.hero.title}
          </h1>
          <p className="text-body-m font-medium text-gray-700">
            {clipContent.hero.description}
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <CategoryPills
          label="클립 카테고리"
          items={clipContent.categories}
          activeHref={activeCategoryHref}
          className={CONTENT_WIDTH}
        />
      </div>

      <ul
        className={cn(
          CONTENT_WIDTH,
          "flex flex-col gap-2 px-3 py-3 sm:gap-7 lg:px-0 lg:py-7",
        )}
      >
        {clips.map((item) => (
          <li key={item.id}>
            <ClipCard item={item} />
          </li>
        ))}
      </ul>

      <Pagination {...pagination} basePath="/clip" query={query} />
    </section>
  );
}
