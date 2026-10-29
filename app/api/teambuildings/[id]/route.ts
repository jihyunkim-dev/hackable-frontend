import { revalidateTag } from "next/cache";
import { withAuth } from "@/utils/authSession";
import {
  RequestDeleteTeambuilding,
  RequestUpdateTeambuilding,
} from "@/utils/requestToSrv";
import { TEAMBUILDING_CACHE_TAG } from "@/utils/teamBuilding";
import { pickTeambuildingRequest } from "@/utils/teamBuildingForm";

// 내가 쓴 팀빌딩 모집글 수정. 보낸 필드만 바뀐다. (작성자가 아니면 백엔드가 거절한다)
// 응답: { id, status }
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  const body = pickTeambuildingRequest(await request.json());
  if (!Number.isInteger(id) || Object.keys(body).length === 0) {
    return new Response(null, { status: 400 });
  }

  const post = await withAuth((accessToken) =>
    RequestUpdateTeambuilding(id, body, accessToken),
  );
  if (!post) return new Response(null, { status: 400 });

  // 공개 팀빌딩 목록·상세 캐시에도 바뀐 내용이 보이도록 지운다.
  revalidateTag(TEAMBUILDING_CACHE_TAG, "max");
  return Response.json({ id: post.teambuilding_id, status: post.status });
}

// 내가 쓴 팀빌딩 모집글 삭제. 성공: 204
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response(null, { status: 400 });

  const deleted = await withAuth((accessToken) =>
    RequestDeleteTeambuilding(id, accessToken),
  );
  if (!deleted) return new Response(null, { status: 400 });

  revalidateTag(TEAMBUILDING_CACHE_TAG, "max");
  return new Response(null, { status: 204 });
}
