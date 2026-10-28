import { withAuth } from "@/utils/authSession";
import { RequestMe } from "@/utils/requestToSrv";

// 현재 로그인한 사용자 정보. 로그인하지 않았으면 { user: null }
// 브라우저는 토큰을 모르므로, 쿠키의 토큰으로 서버에서 대신 /auth/me를 요청한다.
export async function GET() {
  const user = await withAuth((accessToken) => RequestMe(accessToken));
  return Response.json(
    { user },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
