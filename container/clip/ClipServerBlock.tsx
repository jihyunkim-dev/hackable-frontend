import { Suspense } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import HeaderSpacer from "@/components/layout/HeaderSpacer";
import ClipCard, { type ClipItem } from "@/components/section/ClipCard";
import FloatingSearchBar from "@/components/section/FloatingSearchBar";
import ClipFeaturedCarousel, {
  type FeaturedClip,
} from "@/components/section/ClipFeaturedCarousel";
import PromoBanner from "@/components/section/PromoBanner";
import WeeklyClipList, {
  type WeeklyClipItem,
} from "@/components/section/WeeklyClipList";
import CategoryPills from "@/components/ui/CategoryPills";
import MultiLine from "@/components/ui/MultiLine";
import Pagination from "@/components/ui/Pagination";
import { SearchBarSkeleton } from "@/components/ui/SearchBar";
import { PAGE_SIZE } from "@/utils/pagination";
import { bannerContent } from "@/configs/contents/banners";
import { clipContent } from "@/configs/contents/clip";
import { subscribeClipBannerUrl } from "@/configs/urls";
import { cn } from "@/lib/utils";

// 주소(?category·page·q)에 따라 바뀌는 목록
export interface ClipList {
  clips: ClipItem[];
  pagination: { currentPage: number; totalPages: number };
  activeCategoryHref: string;
  // 지금 검색 중인 검색어
  q: string;
  // 페이지 이동 시 유지할 검색 조건
  query: Record<string, string | undefined>;
}

interface ClipServerBlockProps {
  featured: FeaturedClip[];
  weekly: { title: string; items: WeeklyClipItem[] };
  // 요청 때 주소를 읽어 가져오는 목록
  list: Promise<ClipList>;
}

export default function ClipServerBlock({
  featured,
  weekly,
  list,
}: ClipServerBlockProps) {
  return (
    <DefaultLayout>
      <HeaderSpacer />
      <SearchSection query={list.then(({ q }) => q)} />
      <HighlightSection featured={featured} weekly={weekly} />
      <ClipListSection list={list} />
    </DefaultLayout>
  );
}

// 헤더 뒤로 지나가면 화면 아래 플로팅 검색창으로 바뀐다.
// 검색어는 요청 때 정해져, 미리 렌더링되는 화면에는 같은 크기의 빈 자리만 둔다.
function SearchSection({ query }: { query: Promise<string> }) {
  return (
    <section className="p-2 py-5 lg:py-3.5">
      <Suspense
        fallback={
          <div className="flex justify-center">
            <SearchBarSkeleton />
          </div>
        }
      >
        {query.then((q) => (
          <FloatingSearchBar
            action="/clip"
            placeholder={clipContent.searchPlaceholder}
            query={q}
          />
        ))}
      </Suspense>
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

// 제목·설명은 미리 렌더링하고, 카테고리 선택·목록·페이지네이션만 요청 때 채운다.
// 기다리는 동안은 같은 크기의 빈 자리만 둬서 HTML에 H1·목록이 한 번씩만 들어간다.
function ClipListSection({ list }: { list: Promise<ClipList> }) {
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
        {/* 카테고리 줄 높이: p-2.5(20) + py-1(8) + text-label-l 줄 높이(24) */}
        <Suspense fallback={<div aria-hidden className="h-[52px]" />}>
          {list.then(({ activeCategoryHref }) => (
            <CategoryPills
              label="클립 카테고리"
              items={clipContent.categories}
              activeHref={activeCategoryHref}
              className={CONTENT_WIDTH}
            />
          ))}
        </Suspense>
      </div>

      <Suspense fallback={<ClipListSkeleton />}>
        {list.then(({ clips, activeCategoryHref, q, query }) => {
          const activeCategory =
            clipContent.categories.find(
              (item) => item.href === activeCategoryHref,
            ) ?? clipContent.categories[0];

          return (
            <>
              <h2 className={cn(CONTENT_WIDTH, LIST_TITLE_CLASS)}>
                {q
                  ? clipContent.searchListTitle(q)
                  : clipContent.listTitle(activeCategory.label)}
              </h2>
              {clips.length === 0 && (
                <p className="px-3 py-20 text-center text-body-l text-gray-500">
                  {q ? (
                    clipContent.empty.search(q)
                  ) : query.category ? (
                    <MultiLine lines={clipContent.empty.category} />
                  ) : (
                    clipContent.empty.all
                  )}
                </p>
              )}
              <ul className={cn(CONTENT_WIDTH, LIST_CLASS)}>
                {clips.map((item) => (
                  <li key={item.id}>
                    <ClipCard item={item} />
                  </li>
                ))}
              </ul>
            </>
          );
        })}
      </Suspense>

      <Suspense>
        {list.then(({ pagination, query }) => (
          <Pagination {...pagination} basePath="/clip" query={query} />
        ))}
      </Suspense>
    </section>
  );
}

const LIST_TITLE_CLASS =
  "px-5 pt-5 text-heading-xs font-bold text-gray-800 lg:px-2 lg:pt-7";
const LIST_CLASS = "flex flex-col gap-2 px-3 py-3 sm:gap-7 lg:px-0 lg:py-7";

// 목록을 기다리는 동안 목록 제목·카드 자리를 같은 크기로 비워 둔다. (글자·링크 없음)
function ClipListSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className={cn(CONTENT_WIDTH, LIST_TITLE_CLASS)}>
        <div className="h-7 w-48 rounded-md bg-gray-100" />
      </div>
      <ul className={cn(CONTENT_WIDTH, LIST_CLASS)}>
        {Array.from({ length: PAGE_SIZE.clip }, (_, index) => (
          <li key={index} className="flex gap-2 rounded-xl p-2 sm:gap-5 sm:p-5">
            <div className="flex-1 rounded-lg bg-gray-100" />
            <div className="size-28 shrink-0 rounded-lg bg-gray-100 sm:h-60 sm:w-70 sm:rounded-[20px]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
