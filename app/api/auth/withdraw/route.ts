import { revalidateTag } from "next/cache";
import { clearAuthCookies, withAuth } from "@/utils/authSession";
import { RequestWithdraw } from "@/utils/requestToSrv";
import { TEAMBUILDING_CACHE_TAG } from "@/utils/teamBuilding";

// 회원 탈퇴: 성공하면 토큰 쿠키를 지운다. (백엔드에서 바로 로그인이 막힌다)
export async function DELETE() {
  const withdrawn = await withAuth((accessToken) =>
    RequestWithdraw(accessToken),
  );
  if (!withdrawn) return new Response(null, { status: 400 });

  await clearAuthCookies();
  // 탈퇴한 회원의 팀빌딩 글은 백엔드에서 숨겨지므로 공개 목록·상세 캐시도 지운다.
  revalidateTag(TEAMBUILDING_CACHE_TAG, "max");
  return new Response(null, { status: 204 });
}
