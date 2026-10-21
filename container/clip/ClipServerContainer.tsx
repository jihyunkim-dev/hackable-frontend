import {
  createDummyClipList,
  dummyFeaturedClips,
  dummyWeeklyClips,
  dummyWeeklyTitle,
} from "@/configs/contents/dummyData";
import { clipContent } from "@/configs/contents/clip";
import { PAGE_SIZE, paginate, parsePage } from "@/utils/pagination";
import { findCategory, type SearchParams } from "@/utils/searchParams";
import ClipClientContainer from "./ClipClientContainer";
import ClipServerBlock from "./ClipServerBlock";

export default async function ClipServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { category, page } = (await searchParams) ?? {};
  const activeCategory = findCategory(clipContent.categories, category);
  const { items: clips, pagination } = paginate(
    createDummyClipList(PAGE_SIZE.clip * 7),
    parsePage(page),
    PAGE_SIZE.clip,
  );

  // TODO: API 연동 시 requestToSrv의 요청 함수로 교체 (검색어·카테고리·페이지 반영)
  return (
    <ClipClientContainer>
      <ClipServerBlock
        featured={dummyFeaturedClips}
        weekly={{ title: dummyWeeklyTitle, items: dummyWeeklyClips }}
        clips={clips}
        pagination={pagination}
        activeCategoryHref={activeCategory.href}
        query={{
          category: activeCategory.value === "all" ? undefined : activeCategory.value,
        }}
      />
    </ClipClientContainer>
  );
}
