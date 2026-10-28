import { withAuth } from "@/utils/authSession";
import {
  type BookmarkResponse,
  RequestClipBookmark,
  RequestGrantBookmark,
  RequestProjectBookmark,
  RequestTeambuildingBookmark,
} from "@/utils/requestToSrv";

// 북마크 추가(POST)·해제(DELETE). 예: POST /api/bookmarks/project/12
// 응답: { is_bookmarked, bookmark_count }
const requests: Record<
  string,
  (
    id: number,
    isBookmarked: boolean,
    token: string,
  ) => Promise<BookmarkResponse | null>
> = {
  project: RequestProjectBookmark,
  grant: RequestGrantBookmark,
  teambuilding: RequestTeambuildingBookmark,
  clip: RequestClipBookmark,
};

type Context = { params: Promise<{ type: string; id: string }> };

async function toggleBookmark(context: Context, isBookmarked: boolean) {
  const { type, id } = await context.params;
  const request = requests[type];
  const itemId = Number(id);
  if (!request || !Number.isInteger(itemId)) {
    return new Response(null, { status: 400 });
  }

  // 백엔드 요청 함수는 "지금 북마크한 상태인지"를 받아 해제(DELETE)·추가(POST)를 고른다.
  const result = await withAuth((accessToken) =>
    request(itemId, isBookmarked, accessToken),
  );
  if (!result) return new Response(null, { status: 400 });
  return Response.json(result);
}

export async function POST(_request: Request, context: Context) {
  return toggleBookmark(context, false);
}

export async function DELETE(_request: Request, context: Context) {
  return toggleBookmark(context, true);
}
