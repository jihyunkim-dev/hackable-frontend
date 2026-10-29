import { revalidateTag } from "next/cache";
import { withAuth } from "@/utils/authSession";
import { IMAGE_UPLOAD_PREFIX } from "@/utils/imageUpload";
import { isR2PublicUrl } from "@/utils/r2";
import { RequestCreateTeambuilding } from "@/utils/requestToSrv";
import { TEAMBUILDING_CACHE_TAG } from "@/utils/teamBuilding";
import { pickTeambuildingRequest } from "@/utils/teamBuildingForm";

// 팀빌딩 모집글 등록. 응답: { id }
export async function POST(request: Request) {
  const body = pickTeambuildingRequest(await request.json(), (url) =>
    isR2PublicUrl(url, IMAGE_UPLOAD_PREFIX),
  );
  if (!body.title) return new Response(null, { status: 400 });

  const post = await withAuth((accessToken) =>
    RequestCreateTeambuilding({ ...body, title: body.title! }, accessToken),
  );
  if (!post) return new Response(null, { status: 400 });

  // 공개 팀빌딩 목록에 새 글이 바로 보이도록 캐시를 지운다.
  // ("max"는 다음 한 번은 예전 캐시를 보여 주므로, 작성자가 바로 확인할 수 있게 즉시 만료시킨다)
  revalidateTag(TEAMBUILDING_CACHE_TAG, { expire: 0 });
  return Response.json({ id: post.teambuilding_id }, { status: 201 });
}
