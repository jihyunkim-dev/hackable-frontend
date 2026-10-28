import { revalidateTag } from "next/cache";
import { withAuth } from "@/utils/authSession";
import { RequestCreateTeambuilding } from "@/utils/requestToSrv";
import { TEAMBUILDING_CACHE_TAG } from "@/utils/teamBuilding";
import { pickTeambuildingRequest } from "@/utils/teamBuildingForm";

// 팀빌딩 모집글 등록. 응답: { id }
export async function POST(request: Request) {
  const body = pickTeambuildingRequest(await request.json());
  if (!body.title) return new Response(null, { status: 400 });

  const post = await withAuth((accessToken) =>
    RequestCreateTeambuilding({ ...body, title: body.title! }, accessToken),
  );
  if (!post) return new Response(null, { status: 400 });

  // 공개 팀빌딩 목록에 새 글이 보이도록 캐시를 지운다.
  revalidateTag(TEAMBUILDING_CACHE_TAG, "max");
  return Response.json({ id: post.teambuilding_id }, { status: 201 });
}
