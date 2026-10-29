// [더미 데이터] 사용 시 아래 import 주석 해제
// import {
//   createDummyClipList,
//   dummyFeaturedClips,
//   dummyWeeklyClips,
//   dummyWeeklyTitle,
// } from "@/configs/contents/dummyData";
// import { PAGE_SIZE, paginate } from "@/utils/pagination";
import { clipContent } from "@/configs/contents/clip";
import { getClipHighlights, getClipPage } from "@/utils/clip";
import { parsePage } from "@/utils/pagination";
import {
  findCategory,
  parseQuery,
  type SearchParams,
} from "@/utils/searchParams";
import ClipClientContainer from "./ClipClientContainer";
import ClipServerBlock from "./ClipServerBlock";

export default async function ClipServerContainer({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { category, page, q: qParam } = (await searchParams) ?? {};
  const q = parseQuery(qParam);
  const activeCategory = findCategory(clipContent.categories, category);
  const categoryValue =
    activeCategory.value === "all" ? undefined : activeCategory.value;

  // [실제 데이터] 더미 데이터 사용 시 아래 블록 주석 처리
  const [{ items: clips, pagination }, { featured, weekly }] =
    await Promise.all([
      getClipPage(parsePage(page), categoryValue, q),
      getClipHighlights(),
    ]);

  // [더미 데이터] 사용 시 아래 주석 해제
  // const { items: clips, pagination } = paginate(
  //   createDummyClipList(PAGE_SIZE.clip * 7),
  //   parsePage(page),
  //   PAGE_SIZE.clip,
  // );
  // const featured = dummyFeaturedClips;
  // const weekly = { title: dummyWeeklyTitle, items: dummyWeeklyClips };

  return (
    <ClipClientContainer>
      <ClipServerBlock
        featured={featured}
        weekly={weekly}
        clips={clips}
        pagination={pagination}
        activeCategoryHref={activeCategory.href}
        q={q}
        query={{ category: categoryValue, q: q || undefined }}
      />
    </ClipClientContainer>
  );
}
