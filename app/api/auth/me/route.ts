import { cookies } from "next/headers";
import { AUTH_COOKIE, setLoginHint, withAuth } from "@/utils/authSession";
import { RequestMe } from "@/utils/requestToSrv";

// 현재 로그인한 사용자 정보. 로그인하지 않았으면 { user: null }
// 브라우저는 토큰을 모르므로, 쿠키의 토큰으로 서버에서 대신 /auth/me를 요청한다.
export async function GET() {
  const user = await withAuth((accessToken) => RequestMe(accessToken));

  // 로그인 여부 표시를 실제 상태와 맞춘다. (표시가 생기기 전에 로그인한 세션, 만료된 세션)
  const hasHint = (await cookies()).has(AUTH_COOKIE.hint);
  if (user && !hasHint) await setLoginHint();
  if (!user && hasHint) (await cookies()).delete(AUTH_COOKIE.hint);

  return Response.json(
    { user },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
