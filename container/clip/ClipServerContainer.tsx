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
import ClipServerBlock, { type ClipList } from "./ClipServerBlock";

// 검색 파라미터는 요청 때 정해진다. 기다리지 않고 목록 Promise로 넘겨,
// 추천·인기 클립과 제목은 미리 렌더링하고 주소에 따라 바뀌는 부분만 요청 때 채운다. (ServerBlock 안의 Suspense)
export default async function ClipServerContainer({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const list = searchParams.then(async (params): Promise<ClipList> => {
    const { category, page, q: qParam } = params;
    const q = parseQuery(qParam);
    const activeCategory = findCategory(clipContent.categories, category);
    const categoryValue =
      activeCategory.value === "all" ? undefined : activeCategory.value;

    // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
    const { items: clips, pagination } = await getClipPage(
      parsePage(page),
      categoryValue,
      q,
    );

    // [더미 데이터] 사용 시 아래 주석 해제
    // const { items: clips, pagination } = paginate(
    //   createDummyClipList(PAGE_SIZE.clip * 7),
    //   parsePage(page),
    //   PAGE_SIZE.clip,
    // );

    return {
      clips,
      pagination,
      activeCategoryHref: activeCategory.href,
      q,
      query: { category: categoryValue, q: q || undefined },
    };
  });

  // 주소와 상관없는 추천·인기 클립 (캐시되어 미리 렌더링된다)
  // [실제 데이터] 더미 데이터 사용 시 아래 한 줄 주석 처리
  const { featured, weekly } = await getClipHighlights();

  // [더미 데이터] 사용 시 아래 주석 해제
  // const featured = dummyFeaturedClips;
  // const weekly = { title: dummyWeeklyTitle, items: dummyWeeklyClips };

  return (
    <ClipClientContainer>
      <ClipServerBlock featured={featured} weekly={weekly} list={list} />
    </ClipClientContainer>
  );
}
